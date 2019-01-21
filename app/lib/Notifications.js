import firebase from "react-native-firebase";

const testScheduled = new firebase.notifications.Notification()
  .setNotificationId("notificationId")
  .setTitle("Test Scheduled")
  .setBody("This is a test scheduled notification")
  .setData({
    test: "value1",
    scheduled: "value2"
  })
  .android.setChannelId("General")
  .android.setSmallIcon("ic_launcher")
  .ios.setBadge(1);

// const newFriendShare = new firebase.notifications.Notification()
//   .setNotificationId('notificationId')
//   .setTitle('Test Scheduled')
//   .setBody('This is a test scheduled notification')
//   .setData({
//     test: 'value1',
//     scheduled: 'value2',
//   })
//   .android.setChannelId('General')
//   .android.setSmallIcon('ic_launcher')
//   .ios.setBadge(1);

export const notifications = {
  testScheduled
};
