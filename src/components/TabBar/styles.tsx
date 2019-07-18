import { StyleSheet } from 'react-native';
import Layout from '../../styles/Layout';
import colors from '../../styles/Colors';
import createShadow from '../../styles/Shadows';

const shadow = createShadow(4);

export default StyleSheet.create({
  container: {
    backgroundColor: colors.YELLOW,
    ...shadow,
    shadowOffset: { height: -1 * shadow.shadowOffset.height },
    alignItems: 'center',
    paddingVertical: Layout.MARGIN_LONG
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.YELLOW,
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.PADDING_MEDIUM
  }
});
