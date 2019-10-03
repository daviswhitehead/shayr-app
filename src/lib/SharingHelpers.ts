import { Alert } from 'react-native';
import Share from 'react-native-share';

const emailMessageCopy = `
  Send to: shayr.app.developer@gmail.com
  Subject: Shayr App Feedback

  Let us know what you think!
`;

export const sendFeedbackEmail = () => {
  // https://github.com/react-native-community/react-native-device-info
  Alert.alert(
    'Send Feedback',
    `We'd love to hear from you! Do you have any feedback you'd like to Shayr with us? Choose your favorite email app and send us your thoughts!`,
    [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: () =>
          Share.open({
            subject: 'Shayr App Feedback',
            message: emailMessageCopy,
            email: 'shayr.app.developer@gmail.com',
            social: Share.Social.EMAIL
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              err && console.log(err);
            })
      }
    ]
  );
};

// Share.shareSingle({
//   message: 'test',
//   email: 'whitehead.davis@gmail.com',
//   social: Share.Social.EMAIL
// })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     err && console.log(err);
//   })
