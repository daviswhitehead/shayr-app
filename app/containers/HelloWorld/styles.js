import { StyleSheet } from 'react-native';

import colors from '../../styles/Colors';
import layout from '../../styles/Layout';
import { fontSystem } from '../../styles/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.WHITE,
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dividerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.PADDING_MEDIUM,
  },
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    backgroundColor: colors.LIGHT_GRAY,
    height: 1,
    width: '20%',
  },
  descriptionBox: {
    padding: layout.PADDING_MEDIUM,
  },
  header: {
    ...fontSystem.H2,
  },
  body: {
    ...fontSystem.BODY,
  },
  actionByBox: {
    padding: layout.PADDING_MEDIUM,
  },
});
