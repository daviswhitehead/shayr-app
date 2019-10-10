import { StyleSheet } from 'react-native';
import Layout from './Layout';
import Colors from './Colors';

export default StyleSheet.create({
  row: {
    padding: Layout.SPACING_LONG,
    borderTopWidth: Layout.DIVIDER_WIDTH,
    borderBottomWidth: Layout.DIVIDER_WIDTH,
    borderColor: Colors.DIVIDER
  }
});
