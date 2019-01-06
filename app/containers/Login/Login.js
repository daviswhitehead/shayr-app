import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { LoginButton } from "react-native-fbsdk";
import {
  notificationListener,
  notificationOpenedListener
} from "../../lib/NotificationListeners";
import { notificationChannels } from "../../lib/NotificationChannels";
import {
  authSubscription,
  signOutUser,
  locateAccessToken,
  facebookAuthTap,
  facebookAuth,
  signedIn
} from "./actions";
import styles from "./styles";
import vectorLogo from "../../assets/VectorLogo.png";

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authSubscription: () => dispatch(authSubscription()),
    signOutUser: () => dispatch(signOutUser()),
    locateAccessToken: () => dispatch(locateAccessToken()),
    facebookAuthTap: () => dispatch(facebookAuthTap()),
    facebookAuth: (error, result) => dispatch(facebookAuth(error, result)),
    signedIn: () => dispatch(signedIn())
  };
};

class Login extends Component {
  componentDidMount() {
    // check authentication
    this.unsubscribe = this.props.authSubscription();
    this.props.locateAccessToken();

    // setup android notification channels
    notificationChannels.forEach(channel => {
      firebase.notifications().android.createChannel(channel);
    });
    console.log(notificationChannels);

    const notification = new firebase.notifications.Notification()
      .setNotificationId("notificationId")
      .setTitle("My notification title")
      .setBody("My notification body")
      .setData({
        key1: "value1",
        key2: "value2"
      })
      .android.setChannelId("General")
      .android.setSmallIcon("ic_launcher")
      .ios.setBadge(0);
    console.log(notification);

    const date = new Date();
    date.setSeconds(date.getSeconds() + 5);
    console.log(date);

    firebase.notifications().scheduleNotification(notification, {
      fireDate: date.getTime()
    });

    // start notification listeners
    this.notificationListener = notificationListener();
    console.log(this.notificationListener);

    this.notificationOpenedListener = notificationOpenedListener();
    console.log(this.notificationOpenedListener);

    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          const { action, notification } = notificationOpen;
          Alert.alert("getInitialNotification");
        }
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.notificationOpenedListener();
  }

  render() {
    if (this.props.auth.error) {
      console.error("authentication error");
    }

    if (this.props.auth.user && this.props.auth.accessTokenSaved) {
      // kicking off this navigation within render is causing an error
      this.props.signedIn();
    }

    return (
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <Image style={styles.image} source={vectorLogo} />
          <Text style={styles.brand}>shayr</Text>
          <Text style={styles.tagline}>discover together</Text>
        </View>
        <View style={styles.loginContainer}>
          <TouchableWithoutFeedback onPress={this.props.facebookAuthTap}>
            <LoginButton
              readPermissions={["public_profile", "email"]}
              onLoginFinished={(error, result) =>
                this.props.facebookAuth(error, result)
              }
              onLogoutFinished={() => console.log("user logout")}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
