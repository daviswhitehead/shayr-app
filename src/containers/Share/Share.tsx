import { buildAppLink, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import ShareExtension from 'react-native-share-extension';
import { connect } from 'react-redux';
import { State } from 'src/src/redux/Reducers';
import ShareModal from '../../components/ShareModal';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { getCurrentUser, getFBAuthCredential } from '../../lib/FirebaseLogin';
import { queryTypes } from '../../lib/FirebaseQueries';
import { authSubscription } from '../../redux/auth/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { subscribeToFriends } from '../../redux/users/actions';
import { selectUsersFromList } from '../../redux/users/selectors';

// TESTING
// // Switch registerComponent of main app to Share Extension
// // // AppRegistry.registerComponent(
// // //   'shayr',
// // //   () => require('./src/containers/ShareApp').default
// // // );
// // Comment any calls to react-native-share-extension

interface StateProps {
  authUserId: string;
  friends: {
    [userId: string]: User;
  };
}

interface DispatchProps {
  subscribeToFriends: typeof subscribeToFriends;
  authSubscription: typeof authSubscription;
}

interface OwnProps {}

interface OwnState {
  payload: string;
  isLoading: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: State) => {
  if (!selectAuthUserId(state)) {
    return {};
  }

  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    friends: selectUsersFromList(
      state,
      generateListKey(authUserId, queryTypes.USER_FRIENDS),
      'presentation'
    )
  };
};

const mapDispatchToProps = {
  subscribeToFriends,
  authSubscription
};

class Share extends Component<Props, OwnState> {
  modalRef: any;
  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);
    this.state = {
      payload: '',
      isLoading: true
    };
    firebase.analytics().logEvent('SHARE_EXTENSION_LAUNCH');

    this.modalRef = React.createRef();
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.checkLoading();
    firebase.analytics().setCurrentScreen('Share');
    this.subscriptions.push(this.props.authSubscription());
    firebase.analytics().logEvent('SHARE_EXTENSION__AUTH_SUBSCRIPTION');

    try {
      const token = await retrieveToken('accessToken');
      firebase.analytics().logEvent('SHARE_EXTENSION__TOKEN');

      const credential = getFBAuthCredential(token);
      firebase.analytics().logEvent('SHARE_EXTENSION__CREDENTIAL');

      const currentUser = await getCurrentUser(credential);
      firebase.analytics().logEvent('SHARE_EXTENSION__CURRENT_USER');

      const { type, value } = await ShareExtension.data();
      firebase.analytics().logEvent('SHARE_EXTENSION__VALUE');
      // const value =
      //   'https://medium.com/@khreniak/cloud-firestore-security-rules-basics-fac6b6bea18e';

      this.setState({ payload: value });

      if (this.props.authUserId) {
        this.subscriptions.push(
          this.props.subscribeToFriends(this.props.authUserId)
        );
      }
      firebase
        .analytics()
        .logEvent('SHARE_EXTENSION__SUBSCRIBE_TO_FRIENDSHIPS');

      this.modalRef.current.toggleModal();
      firebase.analytics().logEvent('SHARE_EXTENSION__TOGGLE_MODAL');
    } catch (error) {
      console.error(error);
      firebase.analytics().logEvent('SHARE_EXTENSION__ERROR');
    }
  }

  componentDidUpdate(prevProps: Props) {
    // subscribe to friendships
    if (this.props.authUserId && !prevProps.authUserId) {
      this.subscriptions.push(
        this.props.subscribeToFriends(this.props.authUserId)
      );
    }
    firebase.analytics().logEvent('SHARE_EXTENSION__SUBSCRIBE_TO_FRIENDSHIPS');

    this.checkLoading();
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
  }

  checkLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUserId &&
      !_.isEmpty(this.props.friends)
    ) {
      this.setState({ isLoading: false });
    }
  };

  navigateToLogin = () => {
    const url = buildAppLink('shayr', 'shayr', 'Login', {});
    try {
      Platform.OS === 'ios'
        ? ShareExtension.openURL(url)
        : Linking.openURL(url);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  render() {
    return (
      <ShareModal
        ref={this.modalRef}
        isLoading={this.state.isLoading}
        payload={this.state.payload}
        authUserId={this.props.authUserId}
        ownerUserId={this.props.authUserId}
        users={this.props.friends}
        navigateToLogin={this.navigateToLogin}
        onModalWillHide={() => ShareExtension.close()}
        hideBackdrop
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);
