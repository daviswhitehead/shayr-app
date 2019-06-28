import { StyleSheet } from 'react-native';
import colors from '../../styles/Colors';
import Layout from '../../styles/Layout';
import createShadow from '../../styles/Shadows';

const shadow = createShadow(4);

export default StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    ...shadow,
    shadowOffset: {
      height: -1 * shadow.shadowOffset.height
    }
  },
  safeArea: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  action: {
    margin: Layout.MARGIN_LONG
  }
});
