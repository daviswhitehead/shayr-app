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
import { authSubscription, locateAccessToken } from './actions';
import RootNavigator from '../../config/Routes';

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  authSubscription: () => dispatch(authSubscription()),
  locateAccessToken: () => dispatch(locateAccessToken()),
});

class AppWithListeners extends Component {
  static propTypes = {
    authSubscription: PropTypes.func.isRequired,
    locateAccessToken: PropTypes.func.isRequired,
    auth: PropTypes.InstanceOf(Object).isRequired,
  };

  async componentDidMount() {
    const { auth, authSubscription, locateAccessToken } = this.props;
    // listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // setup authentication listeners
    this.unsubscribeAuthSubscription = authSubscription();

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
      console.log('getInitialNotification');

      const { action, notification } = notificationOpen;
      firebase.notifications().removeDeliveredNotification(notification.notificationId);
    }

    // // to test (scheduled) notifications
    // const date = new Date();
    // date.setSeconds(date.getSeconds() + 5);
    // const test = firebase.notifications().scheduleNotification(testScheduledNotification, {
    //   fireDate: date.getTime(),
    // });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.unsubscribeAuthSubscription();
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
    return <RootNavigator />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppWithListeners);
