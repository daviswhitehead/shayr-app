import { Platform, AsyncStorage, AppState } from "react-native";

import firebase from "react-native-firebase";

function displayNotificationFromCustomData(message) {
  console.log("entered display");
  console.log(message);
  if (message.data && message.data.title) {
    let notification = new firebase.notifications.Notification();
    notification = notification
      .setTitle(message.data.title)
      .setBody(message.data.body)
      .setData(message.data)
      .setSound("bell.mp3");
    notification.android.setPriority(
      firebase.notifications.Android.Priority.High
    );
    notification.android.setChannelId("new-shayr-channel");
    firebase.notifications().displayNotification(notification);
  }
}

export async function registerHeadlessListener(message) {
  await AsyncStorage.setItem("headless", new Date().toISOString());
  displayNotificationFromCustomData(message);
}

// these callback will be triggered only when app is foreground or background
export function registerAppListener(navigation) {
  this.notificationListener = firebase
    .notifications()
    .onNotification(notification => {
      notification.android.setChannelId("new-shayr-channel");
      firebase.notifications().displayNotification(notification);
    });
  this.notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(notificationOpen => {
      const notif = notificationOpen.notification;

      if (notif.data.targetScreen === "detail") {
        setTimeout(() => {
          navigation.navigate("Detail");
        }, 500);
      }
      setTimeout(() => {
        alert(`User tapped notification\n${notif.notificationId}`);
      }, 500);
    });

  this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
    // console.log('TOKEN (refreshUnsubscribe)', token);
  });

  this.messageListener = firebase.messaging().onMessage(message => {
    displayNotificationFromCustomData(message);
  });
}
