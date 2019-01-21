import firebase from "react-native-firebase";
import { ts } from "./FirebaseHelpers";
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

    firebase.notifications().displayNotification(notification);
    console.log("displayed");

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

export const notificationTokenListener = userId =>
  // listens for changes to the user's notification token and updates database upon change
  firebase.messaging().onTokenRefresh(notificationToken => {
    console.log("notificationTokenListener");

    return firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ pushToken: notificationToken, updatedAt: ts })
      .then(ref => {
        console.log("savePushToken success");
      })
      .catch(e => {
        console.error(e);
      });
  });
