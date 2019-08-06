import { buildAppLink } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import ShareExtension from 'react-native-share-extension';
import { connect } from 'react-redux';
import ShareModal from '../../components/ShareModal';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { userAnalytics } from '../../lib/FirebaseAnalytics';
import { getCurrentUser, getFBAuthCredential } from '../../lib/FirebaseLogin';
import { subscribeToFriendships } from '../../redux/friendships/actions';
import { selectUsersFromList } from '../../redux/users/selectors';

// TESTING
// // Switch registerComponent of main app to Share Extension
// // // AppRegistry.registerComponent(
// // //   'shayr',
// // //   () => require('./src/containers/ShareApp').default
// // // );
// // Comment any calls to react-native-share-extension

const navigateToLogin = async () => {
  const url = buildAppLink('shayr', 'shayr', 'Login', {});
  try {
    (await Platform.OS) === 'ios'
      ? ShareExtension.openURL(url)
      : Linking.openURL(url);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const mapStateToProps = (state, props) => {
  return {
    users: state.users,
    usersLists: state.usersLists
  };
};

const mapDispatchToProps = (dispatch) => ({
  subscribeToFriendships: (userId) => dispatch(subscribeToFriendships(userId))
});

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUserId: '',
      payload: '',
      friends: {},
      isLoading: true
    };
    firebase.analytics().logEvent('SHARE_EXTENSION_LAUNCH');

    this.modalRef = React.createRef();
    this.subscriptions = [];
  }

  async componentDidMount() {
    firebase.analytics().setCurrentScreen('Share');

    this.subscriptions.push(
      firebase.auth().onAuthStateChanged((user) => {
        this.setState((previousState) => ({
          ...previousState,
          user
        }));
      })
    );

    try {
      const token = await retrieveToken('accessToken');
      const credential = getFBAuthCredential(token);
      const currentUser = await getCurrentUser(credential);
      const authUserId = _.get(currentUser, ['user', 'uid'], '');

      userAnalytics(authUserId);

      const { type, value } = await ShareExtension.data();
      // const value = 'https://medium.com/@khreniak/cloud-firestore-security-rules-basics-fac6b6bea18e';

      this.setState({ authUserId, payload: value });

      this.modalRef.current.toggleModal();

      this.subscriptions.push(
        await this.props.subscribeToFriendships(authUserId)
      );
    } catch (error) {
      console.error(error);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.authUserId &&
      _.get(
        this.props,
        ['usersLists', `${this.state.authUserId}_Friends`, 'isLoaded'],
        false
      ) &&
      !_.get(
        prevProps,
        ['usersLists', `${this.state.authUserId}_Friends`, 'isLoaded'],
        false
      )
    ) {
      this.setState({
        friends: selectUsersFromList(
          this.props,
          `${this.state.authUserId}_Friends`
        ),
        isLoading: false
      });
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  render() {
    return (
      <ShareModal
        ref={this.modalRef}
        payload={this.state.payload}
        authUserId={this.state.authUserId}
        ownerUserId={this.state.authUserId}
        users={this.state.friends}
        navigateToLogin={() => navigateToLogin()}
        onModalWillHide={() => ShareExtension.close()}
        hideBackdrop
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);
