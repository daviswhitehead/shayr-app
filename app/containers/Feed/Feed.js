import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import styles from './styles';
import DynamicActionButton from '../../components/DynamicActionButton';
import Toaster from '../../components/Toaster';
import List from '../../components/List';
import {
  getUsers,
  getUserShares,
  getPost,
  getPostShares,
} from '../../functions/pull';
import {
  savePostToUser,
} from '../../functions/push';
import {
  organizeData,
} from '../../transforms/OrganizePostData';

import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import { LoginManager } from 'react-native-fbsdk';

const mapStateToProps = (state) => {
 return { };
}
const mapDispatchToProps = (dispatch) => ({
  navQueue: () => dispatch(NavigationActions.navigate({ routeName: 'Queue' })),
});

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      isActionButtonVisible: true
    }

    // goes away with redux!
    const navigationParams = _.get(this.props, 'navigation.state.params', null)
    if (navigationParams) {
      this.state = {...this.state, ...navigationParams};
      if (navigationParams.feedData) {
        this.state = {...this.state, loading: false};
      } else {
        this.state = {...this.state, loading: true};
      }
    } else {
      this.state = {...this.state, loading: true};
    }
  }

  loadData = () => {
    const userData = {};
    const postData = {};

    // get users
    getUsers()
      .then((users) => {
        return Promise.all(
          users.map((user) => {
              userData[user.id] = {
                ...user.data(),
                doc: user,
                shares: {}
              };
              return getUserShares(user)
          })
        );
      })
      // get all user shares
      .then((users) => {
        const postRefs = {};
        users.map((userShares) => {
          userShares.map((share) => {
            userData[share.ref.parent.parent.id]['shares'][share.id] = {
              ...share.data(),
              doc: share
            };

            // find all unique posts
            let post = share.data()['post']
            if (post && !postRefs.hasOwnProperty(post.id)) {
              postRefs[post.id] = share.data()['post'];
            }
          })
        })
        return Promise.all(
          Object.values(postRefs).map((post) => {
            return getPost(post)
          })
        )
      })
      // get all friend posts
      .then((posts) => {
        return Promise.all(
          posts.map((post) => {
            postData[post.id] = {
              ...post.data(),
              doc: post,
              shares: {}
            };
            return getPostShares(post.ref)
          })
        )
      })
      // get all shares associated with friend posts
      .then((posts) => {
        posts.map((postShares) => {
          postShares.map((share) => {
            postData[share.ref.parent.parent.id]['shares'][share.id] = {
              ...share.data(),
              doc: share
            };
          })
        })
        this.setState((previousState) => {
          return {
            ...previousState,
            feedData: organizeData(userData, postData),
            loading: false,
            userData: userData,
            postData: postData
          }
        })
      })
      .catch((err) => {
        console.error(err);
      })

  }

  componentDidMount() {
    if (!this.state.feedData) {
      this.loadData()
    }
  }

  addToQueue = (payload) => {
    savePostToUser(this.state.user, payload['key']);
    let toast = Toaster('added to queue');
  }

  addToQueueUI = () => {
    return (
      <View style={styles.leftSwipeItem}>
        <Icon name='add' size={50} color='white' />
      </View>
    );
  }

  _listViewOffset = 0

  // how do i do this with redux??
  _onScroll = (event) => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
    }
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
      this.setState({ isActionButtonVisible })
    }
    // Update your scroll position
    this._listViewOffset = currentOffset
  }

  loading = () => {
    if (this.state.loading) {
      return (
        <Text>LOADING</Text>
      );
    }

    return (
      <List
        data={this.state.feedData}
        swipeLeftToRightUI={this.addToQueueUI}
        swipeLeftToRightAction={this.addToQueue}
        onScroll={this._onScroll}
      >
      </List>
    );
  }

  logout = async () => {
    try {
      await firebase.auth().signOut();
      await LoginManager.logOut();
      this.props.navigation.navigate('Login', this.state);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    // console.log(this.state);
    // console.log(this.props);
    return (
      <View style={styles.container}>
        <this.loading/>
        {
          this.state.isActionButtonVisible ?
          <DynamicActionButton
            logout={this.logout}
            feed={false}
            queue={this.props.navQueue}
          />
           :
          null
        }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
