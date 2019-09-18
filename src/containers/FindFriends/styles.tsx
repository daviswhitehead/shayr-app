import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  sectionHeader: {
    ...fontSystem.H3,
    marginHorizontal: Layout.SPACING_LONG,
    marginBottom: Layout.SPACING_MEDIUM,
    marginTop: Layout.SPACING_LONG
  },
  actionRowIcon: {
    marginRight: Layout.SPACING_MEDIUM
  },
  actionRowIconSize: {
    height: 32,
    width: 32
  },
  actionRowCopy: {
    ...fontSystem.BODY
  },
  emptySearchText: {
    textAlign: 'center',
    margin: Layout.SPACING_LONG,
    ...fontSystem.BODY
  }
});
