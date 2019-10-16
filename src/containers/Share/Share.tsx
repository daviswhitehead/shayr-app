import {
  buildAppLink,
  getURLFromString,
  User
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import ShareExtension from 'react-native-share-extension';
import { connect } from 'react-redux';
import { State } from 'src/src/redux/Reducers';
import ShareModal from '../../components/ShareModal';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { retrieveToken } from '../../lib/AppGroupTokens';
import { logEvent, setCurrentScreen } from '../../lib/FirebaseAnalytics';
import {
  getFacebookAuthCredential,
  signInWithCredential
} from '../../lib/FirebaseLogin';
import { queryTypes } from '../../lib/FirebaseQueries';
import { authSubscription } from '../../redux/auth/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListMeta } from '../../redux/lists/selectors';
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
  friendsMeta: {
    isEmpty: boolean;
    isLoaded: boolean;
    isLoadedAll: boolean;
    isLoading: boolean;
    isRefreshing: boolean;
    lastItem: any;
  };
}

interface DispatchProps {
  subscribeToFriends: typeof subscribeToFriends;
  authSubscription: typeof authSubscription;
}

interface OwnProps {}

interface OwnState {
  url: string;
  isLoading: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: State) => {
  if (!selectAuthUserId(state)) {
    return {};
  }

  const authUserId = selectAuthUserId(state);
  const friendsListKey = generateListKey(authUserId, queryTypes.USER_FRIENDS);

  return {
    authUserId,
    friends: selectUsersFromList(state, friendsListKey, 'presentation'),
    friendsMeta: selectListMeta(state, 'usersLists', friendsListKey)
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
      url: '',
      isLoading: true
    };
    logEvent(AnalyticsDefinitions.category.ACTION, {
      [AnalyticsDefinitions.parameters.LABEL]: AnalyticsDefinitions.label.SHAYR,
      [AnalyticsDefinitions.parameters.STATUS]:
        AnalyticsDefinitions.status.LAUNCHED,
      [AnalyticsDefinitions.parameters.TARGET]:
        AnalyticsDefinitions.target.SHARE_EXTENSION
    });

    this.modalRef = React.createRef();
    this.subscriptions = [];
  }

  async componentDidMount() {
    this.checkLoading();
    setCurrentScreen('Share');
    this.subscriptions.push(this.props.authSubscription());

    try {
      const token = await retrieveToken('accessToken');

      const credential = getFacebookAuthCredential(token);

      const currentUser = await signInWithCredential(credential);

      const { type, value } = await ShareExtension.data();
      // const value =
      //   'https://medium.com/@khreniak/cloud-firestore-security-rules-basics-fac6b6bea18e';

      this.setState({ url: getURLFromString(value) });

      if (this.props.authUserId) {
        this.subscriptions.push(
          this.props.subscribeToFriends(this.props.authUserId)
        );
      }

      this.modalRef.current.toggleModal();
    } catch (error) {
      console.error(error);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // subscribe to friendships
    if (this.props.authUserId && !prevProps.authUserId) {
      this.subscriptions.push(
        this.props.subscribeToFriends(this.props.authUserId)
      );
    }

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
      this.props.friendsMeta &&
      this.props.friendsMeta.isLoaded
    ) {
      this.setState({ isLoading: false });
      logEvent(AnalyticsDefinitions.category.STATE, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.SCREEN_LOADING,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.SUCCESS
      });
    }
  };

  navigateToLogin = () => {
    const appLink = buildAppLink('shayr', 'shayr', 'Login', {});

    try {
      Platform.OS === 'ios'
        ? ShareExtension.openURL(appLink)
        : Linking.openURL(appLink);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  render() {
    return (
      <ShareModal
        ref={this.modalRef}
        isLoading={this.state.isLoading}
        url={this.state.url}
        authUserId={this.props.authUserId}
        ownerUserId={this.props.authUserId}
        users={this.props.friends}
        navigateToLogin={this.navigateToLogin}
        onModalWillHide={() => ShareExtension.close()}
        hideBackdrop
        fromShareExtension
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share);
