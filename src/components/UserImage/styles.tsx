import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  imageBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  small: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    resizeMode: 'cover'
  },
  medium: {
    height: 64,
    width: 64,
    borderRadius: 64 / 2,
    resizeMode: 'cover'
  },
  large: {
    height: 96,
    width: 96,
    borderRadius: 96 / 2,
    resizeMode: 'cover'
  }
});
