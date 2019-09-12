import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: Layout.SPACING_LONG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.DIVIDER
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
