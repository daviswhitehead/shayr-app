import firebase from 'react-native-firebase';

// // to test (scheduled) notifications, add below to AppLoading componentDidMount
// import { testScheduledNotification } from '../../lib/Notifications';
// const date = new Date();
// date.setSeconds(date.getSeconds() + 5);
// const test = firebase.notifications().scheduleNotification(testScheduledNotification, {
//   fireDate: date.getTime(),
// });

export const testScheduledNotification = new firebase.notifications.Notification()
  .setNotificationId('notificationId')
  .setTitle('Test Scheduled')
  .setBody('This is a test scheduled notification')
  .setData({
    channelId: 'General',
    scheduled: 'value2'
  })
  .android.setChannelId('General');

export const requestNotificationPermissions = async () => {
  if (!(await firebase.messaging().hasPermission())) {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return firebase.messaging().getToken();
};
