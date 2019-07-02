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
    marginVertical: Layout.MARGIN_MEDIUM,
    marginHorizontal: Layout.MARGIN_MEDIUM
  },
  profileContent: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    ...fontSystem.H2,
    marginVertical: Layout.MARGIN_MEDIUM
  }
});
