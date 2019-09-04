// https://rnfirebase.io/docs/v5.x.x/notifications/introduction
import firebase from 'react-native-firebase';
import {
  defaults,
  generalGroupNotification,
  groups
} from './NotificationHelpers';

export const notificationDisplayedListener = () =>
  firebase.notifications().onNotificationDisplayed((notification) => {});

export const notificationListener = () =>
  firebase.notifications().onNotification((notification) => {
    // const groupNotificationId = 'test'
    // const body = 'Chats list'
    // const smallIcon = 'ic_launcher'
    // const color = '#FF00FF'

    // const groupNotification = new firebase.notifications.Notification()
    // .setNotificationId(groupNotificationId)
    // .setSubtitle(body) // This is setSubText(..) in Android
    // groupNotification
    // .android.setGroup(groupNotificationId)
    // .android.setGroupSummary(true)
    // .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
    // .android.setChannelId('chat')
    // .android.setSmallIcon(smallIcon) ### // Sets small icon to group notification
    // .android.setColor(color) ### // Sets color to group notification
    // .android.setAutoCancel(true)

    // const title = 'Test Chat'
    // const desc = 'User A added comment: Hello'
    // const nid = '1001' // nid + tag is a composite key to identify the notification
    // const tag = 'Test tag'

    // const notification = new firebase.notifications.Notification()
    // .setNotificationId(nid)
    // .setTitle(title)
    // .setBody(desc)
    // notification // I didn't set smallIcon or color for child notification
    // .android.setBigText(desc)
    // .android.setAutoCancel(true)
    // .android.setChannelId('chat')
    // .android.setTag(tag)
    // .android.setGroup(groupNotificationId)
    // .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)

    // firebase.notifications().displayNotification(groupNotification)
    // firebase.notifications().displayNotification(notification)

    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setBody(notification.body)
      .setData(notification.data)
      .setSound('default')
      // android notification settings
      .android.setChannelId(notification.data.channelId)
      .android.setBigText(notification.body)
      .android.setSmallIcon(defaults.smallIcon)
      .android.setColor(defaults.color)
      .android.setPriority(firebase.notifications.Android.Priority.Default)
      .android.setGroup(groups.GENERAL)
      .android.setGroupAlertBehaviour(
        firebase.notifications.Android.GroupAlert.Children
      )
      // ios notification settings
      .ios.setBadge(Number(notification.data.badge));

    // const localNotification = new firebase.notifications.Notification()
    //   .setNotificationId(notification.notificationId)
    //   .setTitle(notification.title)
    //   .setBody(notification.body)
    //   .setData(notification.data)
    //   .setSound('default')
    //   // android notification settings
    //   .android.setChannelId(notification.data.channelId)
    //   .android.setSmallIcon('@mipmap/ic_notification')
    //   .android.setColor(colors.YELLOW)
    //   .android.setPriority(firebase.notifications.Android.Priority.Default)
    //   .android.setBigText(notification.body)
    //   // ios notification settings
    //   .ios.setBadge(Number(notification.data.badge));

    firebase.notifications().displayNotification(generalGroupNotification);
    firebase.notifications().displayNotification(localNotification);
    firebase
      .notifications()
      .removeDeliveredNotification(localNotification.notificationId);
  });

export const notificationOpenedListener = (handleRouting) =>
  firebase.notifications().onNotificationOpened((notificationOpen) => {
    const { action, notification } = notificationOpen;
    if (notification.data.appLink) {
      handleRouting(notification.data.appLink);
    }
    firebase
      .notifications()
      .removeDeliveredNotification(notification.notificationId);
  });
