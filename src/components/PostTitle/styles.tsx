import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import layout from '../../styles/Layout';

export default StyleSheet.create({
  title: {
    padding: layout.PADDING_MEDIUM,
    ...fontSystem.H2
  }
});
