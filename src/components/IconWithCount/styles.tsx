import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  countBox: {
    height: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: Layout.SPACING_SHORT
  },
  count: {
    textAlignVertical: 'center',
    textAlign: 'center',
    ...fontSystem.ICON_NUMBER_INACTIVE
  },
  activeCount: {
    textAlignVertical: 'center',
    textAlign: 'center',
    ...fontSystem.ICON_NUMBER_ACTIVE
  },
  skeleton: {
    height: 24,
    width: 24 * 2,
    borderRadius: Layout.BORDER_RADIUS_MEDIUM
  }
});
