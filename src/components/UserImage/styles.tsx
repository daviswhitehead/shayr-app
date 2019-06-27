import { StyleSheet } from 'react-native';
import layout from '../../styles/Layout';

export default StyleSheet.create({
  imageBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.PADDING_SHORT
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
