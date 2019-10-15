import React, { Component } from 'react';
import { ActivityIndicator, AppState, Linking, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import RootNavigator from '../../config/Routes';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { currentScreenAnalytics, logEvent } from '../../lib/FirebaseAnalytics';
import { dynamicLinkListener } from '../../lib/FirebaseDynamicLinks';
import { initializeMoment } from '../../lib/MomentHelpers';
import { notificationChannels } from '../../lib/NotificationHelpers';
import {
  notificationDisplayedListener,
  notificationListener,
  notificationOpenedListener
} from '../../lib/NotificationListeners';
import { setTopLevelNavigator } from '../../lib/ReactNavigationHelpers';
import { isAppReady } from '../../redux/app/actions';
import { authSubscription, hasAccessToken } from '../../redux/auth/actions';
import { getOnboardingStatus } from '../../redux/onboarding/actions';
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
  getOnboardingStatus: typeof getOnboardingStatus;
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
  handleURLRoute,
  getOnboardingStatus
};

class AppLoading extends Component<Props> {
  // static whyDidYouRender = true;

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);
    this.subscriptions = [];
  }

  async componentDidMount() {
    // // listen to app state changes
    // AppState.addEventListener('change', this.handleAppStateChange);

    // check authentication and listen for updates
    this.subscriptions.push(this.props.authSubscription());
    this.props.hasAccessToken();

    // console.log('AppLoading Promise');
    // const x = await firebase
    //   .firestore()
    //   .doc('posts/SHAYR_HOW_TO')
    //   .get()
    //   .then((value) => {
    //     console.log('then');
    //     console.log(value);
    //   })
    //   .catch((value) => {
    //     console.log('catch');
    //     console.log(value);
    //   });
    // console.log(x);

    // // setup android notification channels
    // notificationChannels.forEach((channel) => {
    //   firebase.notifications().android.createChannel(channel);
    // });

    // // start notification listeners
    // this.subscriptions.push(notificationDisplayedListener());
    // this.subscriptions.push(notificationListener());
    // this.subscriptions.push(
    //   notificationOpenedListener(this.props.handleURLRoute)
    // );

    // // app launched by notification tap
    // const notificationOpen = await firebase
    //   .notifications()
    //   .getInitialNotification();
    // if (notificationOpen) {
    //   const { action, notification } = notificationOpen;

    //   this.props.handleURLRoute(notification.data.appLink);

    //   firebase
    //     .notifications()
    //     .removeDeliveredNotification(notification.notificationId);
    // }

    // // start deep link listeners
    // this.subscriptions.push(dynamicLinkListener(this.props.handleURLRoute)); // Firebase link
    // Linking.addEventListener('url', this.props.handleURLRoute); // App link

    // // app launched with deep link
    // const dynamicLink = await firebase.links().getInitialLink(); // Firebase link
    // if (dynamicLink) {
    //   this.props.handleURLRoute(dynamicLink);
    // }
    // const deepLink = await Linking.getInitialURL(); // App link
    // if (deepLink) {
    //   this.props.handleURLRoute(deepLink);
    // }

    // // apply moment date/time settings
    // initializeMoment();

    await this.props.getOnboardingStatus();

    this.props.isAppReady(true);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange);
    // Linking.removeEventListener('url', this.props.handleURLRoute);
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      unsubscribe();
    });
    this.props.isAppReady(false);
  }

  handleAppStateChange = (nextAppState) => {
    // https://facebook.github.io/react-native/docs/appstate
    if (nextAppState === 'active') {
      logEvent(AnalyticsDefinitions.category.STATE, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.APP_STATE_ACTIVE,
        [AnalyticsDefinitions.parameters.TARGET]:
          AnalyticsDefinitions.target.APP,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.ACTIVE
      });
    } else if (nextAppState === 'background') {
      logEvent(AnalyticsDefinitions.category.STATE, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.APP_STATE_BACKGROUND,
        [AnalyticsDefinitions.parameters.TARGET]:
          AnalyticsDefinitions.target.APP,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.BACKGROUND
      });
    }
  };

  render() {
    if (this.props.app.isAppReady) {
      return (
        <RootNavigator
          ref={(navigatorRef) => {
            setTopLevelNavigator(navigatorRef);
          }}
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
