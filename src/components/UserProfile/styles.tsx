import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  profileImage: {
    marginVertical: Layout.SPACING_LONG,
    marginHorizontal: Layout.SPACING_LONG
  },
  profileContent: {
    flex: 1,
    flexDirection: 'column'
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  profileName: {
    ...fontSystem.H2,
    marginVertical: Layout.SPACING_MEDIUM
  },
  actionsSpacer: {
    width: Layout.SPACING_LONG
  },
  skeletonProfileName: {
    height: 24,
    width: 24 * 8 + Layout.SPACING_LONG,
    marginVertical: Layout.SPACING_MEDIUM
  }
});
