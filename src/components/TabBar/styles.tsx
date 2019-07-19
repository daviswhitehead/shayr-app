import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const shadow = createShadow(24);

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.YELLOW,
    ...shadow,
    alignItems: 'center',
    paddingVertical: Layout.MARGIN_LONG,
    borderTopWidth: 0.25,
    borderTopColor: Colors.LIGHT_GRAY,
    overflow: 'visible'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.YELLOW,
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.PADDING_MEDIUM
  }
});
