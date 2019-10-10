import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    padding: Layout.SPACING_MEDIUM
  },
  text: {
    ...fontSystem.SECONDARY_BODY
  }
});
