import { Linking } from 'react-native';

export const isURL = url => {
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        return false;
      }
      return true;
    })
    .catch(err => console.error('An error occurred', err));
};

export const openURL = url => {
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        console.warn(`Can't handle url: ${url}`);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => console.error('An error occurred', err));
};

export const test = 'hellow world';
