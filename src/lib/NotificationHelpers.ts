import firebase from 'react-native-firebase';
import Colors from '../styles/Colors';

// DEFAULTS
export const defaults = {
  smallIcon: '@mipmap/ic_notification',
  color: Colors.YELLOW
};

// REQUEST_PERMISSIONS
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

// CHANNELS
export enum channels {
  GENERAL = 'General'
}
const general = new firebase.notifications.Android.Channel(
  'General',
  'General',
  firebase.notifications.Android.Importance.Max
).setDescription('General Notifications');

export const notificationChannels = [general];

// GROUPS
export enum groups {
  GENERAL = 'General'
}
export const generalGroupNotification = new firebase.notifications.Notification()
  .setNotificationId(groups.GENERAL)
  // android settings
  .android.setChannelId(channels.GENERAL)
  .android.setGroup(groups.GENERAL)
  .android.setGroupSummary(true)
  .android.setGroupAlertBehaviour(
    firebase.notifications.Android.GroupAlert.Children
  )
  .android.setSmallIcon(defaults.smallIcon)
  .android.setColor(defaults.color)
  .android.setAutoCancel(true);
// .android.setAutoCancel(false);
