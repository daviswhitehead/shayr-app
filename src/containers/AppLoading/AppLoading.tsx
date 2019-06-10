import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, AppState, Linking, View } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import RootNavigator from '../../config/Routes';
import { currentScreenAnalytics } from '../../lib/FirebaseAnalytics';
import { dynamicLinkListener } from '../../lib/FirebaseDynamicLinks';
import { notificationChannels } from '../../lib/NotificationChannels';
import {
  notificationDisplayedListener,
  notificationListener,
  notificationOpenedListener
} from '../../lib/NotificationListeners';
import { setTopLevelNavigator } from '../../lib/ReactNavigationHelpers';
import { isAppReady } from '../../redux/app/actions';
import { authSubscription, hasAccessToken } from '../../redux/auth/actions';
import { handleURLRoute } from '../../redux/routing/actions';
import styles from './styles';

const mapStateToProps = state => ({
  auth: state.auth,
  app: state.app
});

const mapDispatchToProps = dispatch => ({
  authSubscription: () => dispatch(authSubscription()),
  hasAccessToken: () => dispatch(hasAccessToken()),
  isAppReady: (isReady: boolean) => dispatch(isAppReady(isReady)),
  handleURLRoute: url => dispatch(handleURLRoute(url))
});

class AppLoading extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Object).isRequired,
    authSubscription: PropTypes.func.isRequired,
    hasAccessToken: PropTypes.func.isRequired,
    isAppReady: PropTypes.func.isRequired,
    handleURLRoute: PropTypes.func.isRequired
  };

  async componentDidMount() {
    // listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // check authentication and listen for updates
    this.unsubscribeAuthListener = this.props.authSubscription();
    this.props.hasAccessToken();

    // setup android notification channels
    notificationChannels.forEach(channel => {
      firebase.notifications().android.createChannel(channel);
    });

    // start notification listeners
    this.notificationDisplayedListener = notificationDisplayedListener();
    this.notificationListener = notificationListener();
    this.notificationOpenedListener = notificationOpenedListener(
      this.props.handleURLRoute
    );

    // app launched by notification tap
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { action, notification } = notificationOpen;

      this.props.handleURLRoute(notification.data.appLink);

      firebase
        .notifications()
        .removeDeliveredNotification(notification.notificationId);
    }

    // start deep link listeners
    this.dynamicLinkListener = dynamicLinkListener(this.props.handleURLRoute); // Firebase link
    Linking.addEventListener('url', this.props.handleURLRoute); // App link

    // app launched with deep link
    const dynamicLink = await firebase.links().getInitialLink(); // Firebase link
    if (dynamicLink) {
      this.props.handleURLRoute(dynamicLink);
    }
    const deepLink = await Linking.getInitialURL(); // App link
    if (deepLink) {
      this.props.handleURLRoute(deepLink);
    }

    this.props.isAppReady(true);
  }

  componentWillUnmount() {
    console.log('AppLoading -- componentWillUnmount');

    AppState.removeEventListener('change', this.handleAppStateChange);
    Linking.removeEventListener('url', this.props.handleURLRoute);
    this.unsubscribeAuthListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.props.isAppReady(false);
  }

  handleAppStateChange = nextAppState => {
    // https://facebook.github.io/react-native/docs/appstate
    if (nextAppState === 'active') {
      firebase.analytics().logEvent('APP_STATE_ACTIVE');

      // clear notifications and badge
      firebase.notifications().removeAllDeliveredNotifications();
      firebase.notifications().setBadge(0);
    } else if (nextAppState === 'background') {
      firebase.analytics().logEvent('APP_STATE_BACKGROUND');
    }
    // firebase.analytics().logEvent('APP_STATE_INACTIVE');
  };

  render() {
    if (this.props.app.isAppReady) {
      return (
        <RootNavigator
          ref={navigatorRef => {
            setTopLevelNavigator(navigatorRef);
          }}
          uriPrefix='shayrdev://'
          onNavigationStateChange={(prevState, currentState) => {
            currentScreenAnalytics(prevState, currentState);
          }}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='black' />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLoading);
