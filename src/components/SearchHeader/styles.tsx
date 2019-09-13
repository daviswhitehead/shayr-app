import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE
  },
  header: {
    height: Layout.HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Layout.SPACING_LONG
  }
});
