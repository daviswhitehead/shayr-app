import { Linking } from 'react-native';

export const isURL = (url) => {
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      return false
    } else {
      return true
    }
  }).catch(err => console.error('An error occurred', err));
};
