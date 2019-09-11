import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE
  },
  header: {
    height: Layout.WINDOW_TOP_SAFE_AREA,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Layout.SPACING_LONG
  }
});
