import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { AppState } from 'react-native';
import {
  notificationDisplayedListener,
  notificationListener,
  notificationOpenedListener,
} from '../../lib/NotificationListeners';
import { notificationChannels } from '../../lib/NotificationChannels';
// import { testScheduledNotification } from '../../lib/Notifications';
import { authSubscription, hasAccessToken, areListenersReady } from './actions';
import RootNavigator from '../../config/Routes';
import AppLoading from '../../components/AppLoading';

const mapStateToProps = state => ({
  appListeners: state.appListeners,
});

const mapDispatchToProps = dispatch => ({
  authSubscription: () => dispatch(authSubscription()),
  hasAccessToken: () => dispatch(hasAccessToken()),
  areListenersReady: areReady => dispatch(areListenersReady(areReady)),
});

class AppWithListeners extends Component {
  static propTypes = {
    appListeners: PropTypes.instanceOf(Object).isRequired,
    authSubscription: PropTypes.func.isRequired,
    hasAccessToken: PropTypes.func.isRequired,
    areListenersReady: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    // listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // check authentication and listen for updates
    this.unsubscribeAuthSubscription = this.props.authSubscription();
    this.props.hasAccessToken();

    // setup android notification channels
    notificationChannels.forEach((channel) => {
      firebase.notifications().android.createChannel(channel);
    });

    // start notification listeners
    this.notificationDisplayedListener = notificationDisplayedListener();
    this.notificationListener = notificationListener();
    this.notificationOpenedListener = notificationOpenedListener();

    // app launched by notification tap
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { action, notification } = notificationOpen;
      firebase.notifications().removeDeliveredNotification(notification.notificationId);
    }

    // // to test (scheduled) notifications
    // const date = new Date();
    // date.setSeconds(date.getSeconds() + 5);
    // const test = firebase.notifications().scheduleNotification(testScheduledNotification, {
    //   fireDate: date.getTime(),
    // });

    // firebase.auth().signOut();

    this.props.areListenersReady(true);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.unsubscribeAuthSubscription();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.props.areListenersReady(false);
  }

  handleAppStateChange = (nextAppState) => {
    // https://facebook.github.io/react-native/docs/appstate
    if (nextAppState === 'active') {
      // clear notification badge
      firebase.notifications().setBadge(0);
      firebase.notifications().removeAllDeliveredNotifications();
    }
  };

  render() {
    if (this.props.appListeners.listenersReady) {
      return <RootNavigator />;
    }
    return <AppLoading />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppWithListeners);
