import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, AppState, Linking, View } from 'react-native';
import firebase from 'react-native-firebase';
// import { useScreens } from 'react-native-screens';
import { connect } from 'react-redux';
import { applyFirestoreSettings } from '../../config/FirebaseConfig';
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
import { State } from '../../redux/Reducers';
import { handleURLRoute } from '../../redux/routing/actions';
import styles from './styles';

interface StateProps {
  auth: any;
  app: any;
}

interface DispatchProps {
  authSubscription: typeof authSubscription;
  hasAccessToken: typeof hasAccessToken;
  isAppReady: typeof isAppReady;
  handleURLRoute: typeof handleURLRoute;
}

interface OwnProps {}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: State) => ({
  auth: state.auth,
  app: state.app
});

const mapDispatchToProps = {
  authSubscription,
  hasAccessToken,
  isAppReady,
  handleURLRoute
};

class AppLoading extends Component<Props> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    // listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // enabling screens support before navigator
    // https://github.com/kmagiera/react-native-screens
    // useScreens();

    // apply firestore settings before any other firestore calls
    applyFirestoreSettings();

    // check authentication and listen for updates
    this.subscriptions.push(this.props.authSubscription());
    this.props.hasAccessToken();

    // setup android notification channels
    notificationChannels.forEach((channel) => {
      firebase.notifications().android.createChannel(channel);
    });

    // start notification listeners
    this.subscriptions.push(notificationDisplayedListener());
    this.subscriptions.push(notificationListener());
    this.subscriptions.push(
      notificationOpenedListener(this.props.handleURLRoute)
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
    this.subscriptions.push(dynamicLinkListener(this.props.handleURLRoute)); // Firebase link
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
    AppState.removeEventListener('change', this.handleAppStateChange);
    Linking.removeEventListener('url', this.props.handleURLRoute);
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
    this.props.isAppReady(false);
  }

  handleAppStateChange = (nextAppState) => {
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
          ref={(navigatorRef) => {
            setTopLevelNavigator(navigatorRef);
          }}
          // uriPrefix='shayr://'
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
