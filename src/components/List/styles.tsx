import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.DIVIDER
  },
  loadingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.MARGIN_LONG
  }
});
