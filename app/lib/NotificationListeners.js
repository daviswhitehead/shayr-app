import firebase from "react-native-firebase";
import { colors } from "../styles/Colors";
import { ts } from "./FirebaseHelpers";
// https://rnfirebase.io/docs/v5.x.x/notifications/introduction

export const notificationDisplayedListener = () =>
  // app in foreground
  firebase.notifications().onNotificationDisplayed(notification => {});

export const notificationListener = () =>
  // app in foreground
  firebase.notifications().onNotification(notification => {
    const localNotification = new firebase.notifications.Notification({
      sound: "default",
      show_in_foreground: true,
      show_in_background: true
    })
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body)
      .setData(notification.data)
      .android.setChannelId("General")
      .android.setSmallIcon("@mipmap/ic_notification")
      .android.setColor(colors.YELLOW)
      .android.setPriority(firebase.notifications.Android.Priority.High);

    firebase.notifications().displayNotification(localNotification);
    firebase
      .notifications()
      .removeDeliveredNotification(localNotification.notificationId);
  });

export const notificationOpenedListener = () =>
  // app in background
  firebase.notifications().onNotificationOpened(notificationOpen => {
    const { action, notification } = notificationOpen;
    firebase
      .notifications()
      .removeDeliveredNotification(notification.notificationId);
  });

export const notificationTokenListener = userId =>
  // listens for changes to the user's notification token and updates database upon change
  firebase.messaging().onTokenRefresh(notificationToken => {
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
