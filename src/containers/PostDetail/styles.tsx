import { StyleSheet } from 'react-native';

import colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: Layout.MARGIN_LONG
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionBox: {
    marginBottom: Layout.MARGIN_LONG
  },
  sectionHeader: {
    ...fontSystem.H2,
    marginVertical: Layout.MARGIN_MEDIUM
  },
  body: {
    ...fontSystem.BODY
  },
  boldBody: {
    ...fontSystem.BOLD_BODY,
    marginLeft: Layout.MARGIN_SHORT
  },
  activityBox: {
    marginBottom: Layout.MARGIN_LONG
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
