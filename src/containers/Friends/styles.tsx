import { StyleSheet } from 'react-native';

import colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dividerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.PADDING_MEDIUM
  },
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  divider: {
    backgroundColor: colors.LIGHT_GRAY,
    height: 1,
    width: '20%'
  },
  descriptionBox: {
    padding: Layout.PADDING_MEDIUM
  },
  header: {
    ...fontSystem.H2
  },
  body: {
    ...fontSystem.BODY
  },
  sampleView: {
    width: Layout.WINDOW_WIDTH,
    height: 100,
    backgroundColor: 'blue'
  }
});
