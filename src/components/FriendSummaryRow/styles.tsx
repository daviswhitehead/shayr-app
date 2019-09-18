import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import Stylesheet from '../../styles/Stylesheet';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...Stylesheet.row
  },
  userImage: {
    marginRight: Layout.SPACING_LONG
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  userName: {
    ...fontSystem.H2,
    marginBottom: Layout.SPACING_MEDIUM
  },
  userNameSkeleton: {
    height: 24,
    width: 24 * 8,
    marginBottom: Layout.SPACING_MEDIUM
  },
  actionsSpacer: {
    width: Layout.SPACING_LONG
  }
});
