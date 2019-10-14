import { Alert } from 'react-native';
import Share from 'react-native-share';
import * as AnalyticsDefinitions from './AnalyticsDefinitions';
import { logEvent } from './FirebaseAnalytics';

export const emailMessageCopy = `
  Send to: shayr.app.developer@gmail.com
  Subject: Shayr App Feedback

  Let us know what you think!
`;

const inviteMessageCopy = `
I'm using Shayr to get to know my friends better! It helps keep track of all of the content recommendations I give and receive. Shayr makes it easy to see what someone is interested in and actually have meaningful interactions after finishing a recommendation. Want to check it out with me?
`;

export const sendFeedbackEmail = () => {
  // https://github.com/react-native-community/react-native-device-info
  Alert.alert(
    'Send Feedback',
    `We'd love to hear from you! Do you have any feedback you'd like to Shayr with us? Choose your favorite email app and send us your thoughts!`,
    [
      {
        text: 'Cancel',
        onPress: () => {
          logEvent(AnalyticsDefinitions.category.ACTION, {
            [AnalyticsDefinitions.parameters.LABEL]:
              AnalyticsDefinitions.label.SEND_FEEDBACK,
            [AnalyticsDefinitions.parameters.STATUS]:
              AnalyticsDefinitions.status.CANCEL
          });
        },
        style: 'cancel'
      },
      {
        text: 'Yes',
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
            .then(() => {
              logEvent(AnalyticsDefinitions.category.ACTION, {
                [AnalyticsDefinitions.parameters.LABEL]:
                  AnalyticsDefinitions.label.SEND_FEEDBACK,
                [AnalyticsDefinitions.parameters.STATUS]:
                  AnalyticsDefinitions.status.SUCCESS
              });
            })
            .catch(() => {
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

export const sendShayrDownloadInvite = () => {
  const message = `I'm using Shayr to get to know my friends better! It helps keep track of all of the content recommendations I give and receive. Shayr makes it easy to see what someone is interested in and actually have meaningful interactions after finishing a recommendation. Want to check it out with me? Here's the download link: https://shayr.page.link/download`;

  logEvent(AnalyticsDefinitions.category.ACTION, {
    [AnalyticsDefinitions.parameters.LABEL]:
      AnalyticsDefinitions.label.SEND_DOWNLOAD_INVITE,
    [AnalyticsDefinitions.parameters.STATUS]: AnalyticsDefinitions.status.START
  });
  Share.open({
    message
  })
    .then(() => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.SEND_DOWNLOAD_INVITE,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.SUCCESS
      });
    })
    .catch(() => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.SEND_DOWNLOAD_INVITE,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.REJECT
      });
    });
};

export const sendShayrPostInvite = (link: string) => {
  const message = `I think you'd really enjoy checking out this content: ${link}.
  
Also, I'm using Shayr to keep track of content recommendations like these. It's awesome, want to check it out with me? Here's the download link: https://shayr.page.link/download`;

  logEvent(AnalyticsDefinitions.category.ACTION, {
    [AnalyticsDefinitions.parameters.LABEL]:
      AnalyticsDefinitions.label.SEND_POST_INVITE,
    [AnalyticsDefinitions.parameters.STATUS]: AnalyticsDefinitions.status.START
  });
  Share.open({
    message
  })
    .then(() => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.SEND_POST_INVITE,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.SUCCESS
      });
    })
    .catch(() => {
      logEvent(AnalyticsDefinitions.category.ACTION, {
        [AnalyticsDefinitions.parameters.LABEL]:
          AnalyticsDefinitions.label.SEND_POST_INVITE,
        [AnalyticsDefinitions.parameters.STATUS]:
          AnalyticsDefinitions.status.REJECT
      });
    });
};
