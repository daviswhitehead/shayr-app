import { StyleSheet } from 'react-native';
import Layout from './Layout';
import Colors from './Colors';

export default StyleSheet.create({
  row: {
    padding: Layout.SPACING_LONG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.DIVIDER
  }
});
