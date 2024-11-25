import { Alert } from 'react-native';
import Share from 'react-native-share';
import * as AnalyticsDefinitions from './AnalyticsDefinitions';
import { logEvent } from './FirebaseAnalytics';
import { emailMessageCopy } from './SharingHelpers';

export const ComingSoonAlert = () => {
  logEvent(AnalyticsDefinitions.category.ACTION, {
    [AnalyticsDefinitions.parameters.LABEL]:
      AnalyticsDefinitions.label.COMING_SOON
  });

  Alert.alert(
    'Coming Soon!',
    `Thanks for checking out Shayr and trying this feature... Unfortunately, we haven't built it yet :/

If you'd like to drop us a line and chat more, send us an email!`,
    [
      {
        text: 'Ok',
        onPress: () => {
          logEvent(AnalyticsDefinitions.category.ACTION, {
            [AnalyticsDefinitions.parameters.LABEL]:
              AnalyticsDefinitions.label.SEND_FEEDBACK,
            [AnalyticsDefinitions.parameters.STATUS]:
              AnalyticsDefinitions.status.DISMISS
          });
        },
        style: 'cancel'
      },
      {
        text: 'Email',
        onPress: () => {
          logEvent(AnalyticsDefinitions.category.ACTION, {
            [AnalyticsDefinitions.parameters.LABEL]:
              AnalyticsDefinitions.label.SEND_FEEDBACK,
            [AnalyticsDefinitions.parameters.STATUS]:
              AnalyticsDefinitions.status.START
          });
          Share.open({
            subject: 'Shayr App Feedback',
            message: emailMessageCopy,
            email: 'shayr.app.developer@gmail.com',
            social: Share.Social.EMAIL
          })
            .then((res: any) => {
              logEvent(AnalyticsDefinitions.category.ACTION, {
                [AnalyticsDefinitions.parameters.LABEL]:
                  AnalyticsDefinitions.label.SEND_FEEDBACK,
                [AnalyticsDefinitions.parameters.STATUS]:
                  AnalyticsDefinitions.status.SUCCESS
              });
            })
            .catch((err: Error) => {
              logEvent(AnalyticsDefinitions.category.ACTION, {
                [AnalyticsDefinitions.parameters.LABEL]:
                  AnalyticsDefinitions.label.SEND_FEEDBACK,
                [AnalyticsDefinitions.parameters.STATUS]:
                  AnalyticsDefinitions.status.REJECT
              });
            });
        }
      }
    ]
  );
};
