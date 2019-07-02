import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.DIVIDER
  },
  segment: {
    marginHorizontal: Layout.MARGIN_MEDIUM,
    paddingHorizontal: Layout.PADDING_MEDIUM
  },
  activeSegment: {
    marginHorizontal: Layout.MARGIN_MEDIUM,
    paddingHorizontal: Layout.PADDING_MEDIUM,
    marginBottom: -1,
    borderBottomWidth: 3,
    borderColor: Colors.YELLOW
  },
  iconContainer: {
    marginVertical: Layout.MARGIN_MEDIUM
  }
});
