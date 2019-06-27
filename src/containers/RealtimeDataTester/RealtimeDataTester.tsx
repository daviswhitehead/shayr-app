import _ from 'lodash';
import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { getUser, subscribeToUser } from '../../redux/users/actions';
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
    users: state.users
  };
};

const mapDispatchToProps = dispatch => ({
  subscribeToUser: userId => dispatch(subscribeToUser(userId)),
  getUser: userId => dispatch(getUser(userId)),
  changeLastName: (userId, lastName) =>
    dispatch(changeLastName(userId, lastName))
});

class RealtimeDataTester extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.subscriptions.push(
      await this.props.subscribeToUser(this.props.authUserId)
    );
    this.props.getUser('myySXfLM5OS12lMpC39otvfXrwj2');
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach(unsubscribe => {
      unsubscribe();
    });
  }

  onSubscriptionPress = async userId => {
    console.log('pressed');

    // Sanders
    return firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .set(
        {
          // lastName: 'changed'
          lastName: 'Sanders'
        },
        { merge: true }
      );
  };

  onOtherPress = async userId => {
    console.log('pressed');

    // Wang
    // this.props.changeLastName(userId, 'changed');
    this.props.changeLastName(userId, 'Wang');
  };

  render() {
    console.log(this.state);
    console.log(this.props);
    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text>Hello World</Text>
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
