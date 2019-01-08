import firebase from "react-native-firebase";
import { Alert } from "react-native";
// https://rnfirebase.io/docs/v5.x.x/notifications/introduction

export const notificationDisplayedListener = () =>
  // app in foreground
  firebase.notifications().onNotificationDisplayed(notification => {
    console.log("onNotificationDisplayed");
    console.log(notification);
    // Alert.alert('onNotification');
  });

export const notificationListener = () =>
  // app in foreground
  firebase.notifications().onNotification(notification => {
    console.log("notificationListener");
    notification.android.setChannelId("General");
    console.log(notification);

    const newNotification = new firebase.notifications.Notification()
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setBody(notification.body)
      .setData(notification.data)
      .setSound("default")
      .android.setChannelId("test-channel")
      .android.setSmallIcon("ic_launcher")
      .android.setPriority(firebase.notifications.Android.Priority.High);
    firebase.notifications().displayNotification(newNotification);
    // Alert.alert('onNotification');

    // firebase.notifications().displayNotification(notification);
    // firebase.notifications().removeDeliveredNotification(notification.notificationId);
  });

export const notificationOpenedListener = () =>
  // app in background
  firebase.notifications().onNotificationOpened(notificationOpen => {
    console.log("notificationOpenedListener");
    // Alert.alert('onNotificationOpened');
    const { action, notification } = notificationOpen;
    firebase
      .notifications()
      .removeDeliveredNotification(notification.notificationId);
    console.log("OPEN:", notification);
  });
