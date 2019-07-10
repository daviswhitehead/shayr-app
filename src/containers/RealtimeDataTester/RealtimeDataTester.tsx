import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  arrayRemove,
  arrayUnion,
  increment,
  ts
} from '../../lib/FirebaseHelpers';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { postAction } from '../../redux/postActions/actions';
import { getUser, subscribeToUser } from '../../redux/users/actions';
import {
  loadSingleUsersPosts,
  subscribeSingleUsersPosts
} from '../../redux/usersPosts/actions';
import styles from './styles';

const changeLastName = (userId: string, lastName: string) => async (
  dispatch: Dispatch
) => {
  dispatch({ type: 'CHANGE_LAST_NAME', userId, lastName });
};

// case types.CHANGE_LAST_NAME: {
//   return {
//     ...state,
//     [action.userId]: {
//       ...state[action.userId],
//       lastName: action.lastName
//     }
//   };
// }

const mapStateToProps = state => {
  const authUserId = selectAuthUserId(state);

  return {
    auth: state.auth,
    authUserId,
    users: state.users,
    usersPosts: state.usersPosts
  };
};

const mapDispatchToProps = dispatch => ({
  subscribeToUser: userId => dispatch(subscribeToUser(userId)),
  subscribeSingleUsersPosts: (userId: string, postId: string) =>
    dispatch(subscribeSingleUsersPosts(userId, postId)),
  getUser: userId => dispatch(getUser(userId)),
  changeLastName: (userId, lastName) =>
    dispatch(changeLastName(userId, lastName)),
  onActionPress: (
    userId: string,
    postId: string,
    actionType: ActionType,
    isNowActive: boolean
  ) => dispatch(postAction(userId, postId, actionType, isNowActive)),
  loadSingleUsersPosts: (userId: string, postId: string, source: string) =>
    dispatch(loadSingleUsersPosts(userId, postId, source))
});

class RealtimeDataTester extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.subscriptions.push(
      await this.props.subscribeToUser(this.props.authUserId)
      // await this.props.subscribeSingleUsersPosts(
      //   this.props.authUserId,
      //   'cd2qGlHClQvzHnO1m5xY'
      // )
    );
    await this.props.getUser('myySXfLM5OS12lMpC39otvfXrwj2');
    await this.props.loadSingleUsersPosts(
      'm592UXpes3azls6LnhN2VOf2PyT2',
      'cd2qGlHClQvzHnO1m5xY',
      'server'
    );
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  altToggleAdd = async (isNowActive: boolean) => {
    // update data
    const batch = firebase.firestore().batch();

    batch.set(
      firebase
        .firestore()
        .collection('users_posts')
        .doc('m592UXpes3azls6LnhN2VOf2PyT2_cd2qGlHClQvzHnO1m5xY'),
      {
        addCount: increment(isNowActive ? 1 : -1),
        adds: isNowActive
          ? arrayUnion('m592UXpes3azls6LnhN2VOf2PyT2')
          : arrayRemove('m592UXpes3azls6LnhN2VOf2PyT2'),
        updatedAt: ts
      },
      { merge: true }
    );
    batch.set(
      firebase
        .firestore()
        .collection('adds')
        .doc('m592UXpes3azls6LnhN2VOf2PyT2_cd2qGlHClQvzHnO1m5xY'),
      {
        active: isNowActive,
        updatedAt: ts
      },
      { merge: true }
    );
    await batch.commit();
    // get updated data from cache
    await this.props.loadSingleUsersPosts(
      'm592UXpes3azls6LnhN2VOf2PyT2',
      'cd2qGlHClQvzHnO1m5xY',
      'cache'
    );
  };

  onSubscriptionPress = async userId => {
    // console.log('pressed');

    // Sanders
    return firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .set(
        {
          lastName: 'changed'
          // lastName: 'Sanders'
        },
        { merge: true }
      );
  };

  onOtherPress = async userId => {
    // console.log('pressed');

    // Wang
    // this.props.changeLastName(userId, 'changed');
    this.props.changeLastName(userId, 'Wang');
  };

  render() {
    // console.log(this.state);
    // console.log(this.props);
    // console.log(firebase.firestore().settings());

    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text>
            {JSON.stringify(
              _.pick(
                _.get(
                  this.props,
                  [
                    'usersPosts',
                    'm592UXpes3azls6LnhN2VOf2PyT2_cd2qGlHClQvzHnO1m5xY'
                  ],
                  {}
                ),
                ['adds', 'addCount']
              )
            )}
          </Text>
          <Button
            title='toggle alt add'
            onPress={() =>
              this.altToggleAdd(
                !_.includes(
                  _.get(
                    this.props,
                    [
                      'usersPosts',
                      'm592UXpes3azls6LnhN2VOf2PyT2_cd2qGlHClQvzHnO1m5xY',
                      'adds'
                    ],
                    []
                  ),
                  'm592UXpes3azls6LnhN2VOf2PyT2'
                )
              )
            }
          />
          <Button
            title='toggle add'
            onPress={() =>
              this.props.onActionPress(
                'm592UXpes3azls6LnhN2VOf2PyT2',
                'cd2qGlHClQvzHnO1m5xY',
                'adds',
                !_.includes(
                  _.get(
                    this.props,
                    [
                      'usersPosts',
                      'm592UXpes3azls6LnhN2VOf2PyT2_cd2qGlHClQvzHnO1m5xY',
                      'adds'
                    ],
                    []
                  ),
                  'm592UXpes3azls6LnhN2VOf2PyT2'
                )
              )
            }
          />
          <Button
            title='change subscription'
            onPress={() =>
              this.onSubscriptionPress('m592UXpes3azls6LnhN2VOf2PyT2')
            }
          />
          <Button
            title='change get'
            onPress={() => this.onOtherPress('myySXfLM5OS12lMpC39otvfXrwj2')}
          />
          <Text>
            {_.get(
              this.props,
              ['users', 'm592UXpes3azls6LnhN2VOf2PyT2', 'lastName'],
              ''
            )}
          </Text>
          <Text>
            {_.get(
              this.props,
              ['users', 'myySXfLM5OS12lMpC39otvfXrwj2', 'lastName'],
              ''
            )}
          </Text>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealtimeDataTester);
