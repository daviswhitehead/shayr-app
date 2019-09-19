import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import Stylesheet from '../../styles/Stylesheet';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...Stylesheet.row
  },
  icon: {
    marginRight: Layout.SPACING_MEDIUM
  },
  iconSize: {
    height: 32,
    width: 32
  },
  copy: {
    ...fontSystem.BODY
  },
  copySkeleton: {
    height: 24,
    width: 24 * 8
  }
});
