import firebase from 'react-native-firebase';
import colors from '../styles/Colors';
// https://rnfirebase.io/docs/v5.x.x/notifications/introduction

export const notificationDisplayedListener = () => firebase.notifications().onNotificationDisplayed((notification) => {});

export const notificationListener = () => firebase.notifications().onNotification((notification) => {
  const localNotification = new firebase.notifications.Notification()
    .setNotificationId(notification.notificationId)
    .setTitle(notification.title)
    .setSubtitle(notification.subtitle)
    .setBody(notification.body)
    .setData(notification.data)
    .setSound('default')
  // android notification settings
    .android.setChannelId(notification.data.channelId)
    .android.setSmallIcon('@mipmap/ic_notification')
    .android.setColor(colors.YELLOW)
    .android.setPriority(firebase.notifications.Android.Priority.Default)
    .android.setBigText(notification.body)
  // ios notification settings
    .ios.setBadge(1);

  firebase.notifications().displayNotification(localNotification);
  firebase.notifications().removeDeliveredNotification(localNotification.notificationId);
});

export const notificationOpenedListener = handleRouting => firebase.notifications().onNotificationOpened((notificationOpen) => {
  const { action, notification } = notificationOpen;
  if (notification.data.appLink) {
    handleRouting(notification.data.appLink);
  }
  firebase.notifications().removeDeliveredNotification(notification.notificationId);
});
