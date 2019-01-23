import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { initializeListeners } from "react-navigation-redux-helpers";
import firebase from "react-native-firebase";
import {
  notificationDisplayedListener,
  notificationListener,
  notificationOpenedListener
} from "../../lib/NotificationListeners";
import { notificationChannels } from "../../lib/NotificationChannels";
// import { notifications } from '../../lib/Notifications';
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
      console.log(notificationOpen);
      const { action, notification } = notificationOpen;
    }

    // to test (scheduled) notifications
    // const date = new Date();
    // date.setSeconds(date.getSeconds() + 10);
    // const test = firebase.notifications().scheduleNotification(notifications.testScheduled, {
    //   fireDate: date.getTime(),
    // });
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = navigationPropConstructor(dispatch, nav);
    return <RootNavigator navigation={navigation} />;
  }
}

export default connect(mapStateToProps)(AppWithListeners);
