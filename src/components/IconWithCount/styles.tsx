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
    marginLeft: Layout.MARGIN_SHORT
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
  }
});
