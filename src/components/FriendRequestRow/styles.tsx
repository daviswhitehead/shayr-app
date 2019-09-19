import { StyleSheet } from 'react-native';
import Layout from '../../styles/Layout';
import Stylesheet from '../../styles/Stylesheet';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Stylesheet.row
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionsSpacer: {
    marginRight: Layout.SPACING_LONG
  }
});
