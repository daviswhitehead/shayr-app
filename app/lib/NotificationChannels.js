import firebase from "react-native-firebase";

const general = new firebase.notifications.Android.Channel(
  "General",
  "General",
  firebase.notifications.Android.Importance.Max
).setDescription("General notifications");

export const notificationChannels = [general];
