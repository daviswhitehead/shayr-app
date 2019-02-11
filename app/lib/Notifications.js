import firebase from "react-native-firebase";

export const testScheduledNotification = new firebase.notifications.Notification()
  .setNotificationId("notificationId")
  .setTitle("Test Scheduled")
  .setBody("This is a test scheduled notification")
  .setData({
    channelId: "General",
    scheduled: "value2"
  })
  .android.setChannelId("General");
