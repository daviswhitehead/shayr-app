import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.SPACING_LONG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.DIVIDER
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionsSpacer: {
    width: Layout.SPACING_LONG
  }
});
