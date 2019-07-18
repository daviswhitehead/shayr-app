import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  verticalName: {
    ...fontSystem.NAME,
    padding: layout.PADDING_SHORT
  },
  horizontalName: {
    ...fontSystem.BODY,
    padding: layout.PADDING_MEDIUM
  }
});
