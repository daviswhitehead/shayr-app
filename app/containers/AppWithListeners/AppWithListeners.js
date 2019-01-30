import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { initializeListeners } from "react-navigation-redux-helpers";
import firebase from "react-native-firebase";
import { AppState } from "react-native";
import {
  notificationDisplayedListener,
  notificationListener,
  notificationOpenedListener
} from "../../lib/NotificationListeners";
import { notificationChannels } from "../../lib/NotificationChannels";
// import { notifications } from "../../lib/Notifications";
import { RootNavigator } from "../../config/Routes";
import { navigationPropConstructor } from "../../redux/ReduxNavigation";

const mapStateToProps = state => {
  return {
    nav: state.nav
  };
};

class AppWithListeners extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired
  };

  async componentDidMount() {
    // listen to app state changes
    AppState.addEventListener("change", this._handleAppStateChange);

    // navigation listeners
    initializeListeners("root", this.props.nav);

    // setup android notification channels
    notificationChannels.forEach(channel => {
      firebase.notifications().android.createChannel(channel);
    });

    // start notification listeners
    this.notificationDisplayedListener = notificationDisplayedListener();
    this.notificationListener = notificationListener();
    this.notificationOpenedListener = notificationOpenedListener();

    // app launched by notification tap
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      console.log("getInitialNotification");

      const { action, notification } = notificationOpen;
      firebase
        .notifications()
        .removeDeliveredNotification(notification.notificationId);
    }

    // // to test (scheduled) notifications
    // const date = new Date();
    // date.setSeconds(date.getSeconds() + 5);
    // const test = firebase
    //   .notifications()
    //   .scheduleNotification(notifications.testScheduled, {
    //     fireDate: date.getTime()
    //   });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

  _handleAppStateChange = nextAppState => {
    // https://facebook.github.io/react-native/docs/appstate
    if (nextAppState === "active") {
      // clear notification badge
      firebase.notifications().setBadge(0);
      firebase.notifications().removeAllDeliveredNotifications();
    }
  };

  render() {
    const { dispatch, nav } = this.props;
    const navigation = navigationPropConstructor(dispatch, nav);
    return <RootNavigator navigation={navigation} />;
  }
}

export default connect(mapStateToProps)(AppWithListeners);
