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
    console.log("notificationListener");
    console.log(notification);

    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body)
      .setData(notification.data)
      .setSound("default")
      // android notification settings
      .android.setChannelId(notification.data.channelId)
      .android.setSmallIcon("@mipmap/ic_notification")
      .android.setColor(colors.YELLOW)
      .android.setPriority(firebase.notifications.Android.Priority.Default)
      .android.setBigText(notification.body)
      // ios notification settings
      .ios.setBadge(1);

    firebase.notifications().displayNotification(localNotification);
    firebase
      .notifications()
      .removeDeliveredNotification(localNotification.notificationId);
  });

export const notificationOpenedListener = () =>
  // app in background
  firebase.notifications().onNotificationOpened(notificationOpen => {
    console.log("notificationOpenedListener");

    const { action, notification } = notificationOpen;
    console.log(notification);

    firebase
      .notifications()
      .removeDeliveredNotification(notification.notificationId);
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
