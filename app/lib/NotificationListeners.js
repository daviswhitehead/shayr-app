import firebase from "react-native-firebase";
import { Alert } from "react-native";
// https://rnfirebase.io/docs/v5.x.x/notifications/introduction

export const notificationListener = () =>
  // app in foreground
  firebase.notifications().onNotification(notification => {
    console.log("notificationListener");
    // notification.android.setChannelId('new-shayr-channel');
    console.log(notification);
    Alert.alert("onNotification");

    firebase.notifications().displayNotification(notification);
  });

export const notificationOpenedListener = () =>
  // app in background
  firebase.notifications().onNotificationOpened(notificationOpen => {
    console.log("notificationOpenedListener");
    Alert.alert("onNotificationOpened");
    const { action, notification } = notificationOpen;
    console.log("OPEN:", notification);
  });
