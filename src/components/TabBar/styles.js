import { StyleSheet, Dimensions } from 'react-native';
import layout from '../../styles/Layout';
import colors from '../../styles/Colors';
import createShadow from '../../styles/Shadows';

const shadow = createShadow(4);

export default StyleSheet.create({
  container: {
    backgroundColor: colors.YELLOW,
    ...shadow,
    shadowOffset: { height: -1 * shadow.shadowOffset.height },
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.YELLOW,
    width: Dimensions.get('window').width * 0.8,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.PADDING_MEDIUM,
  },
});
