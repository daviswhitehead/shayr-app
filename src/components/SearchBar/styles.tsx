import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_GRAY20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Layout.SPACING_LONG,
    paddingVertical: Layout.SPACING_MEDIUM,
    borderRadius: Layout.BORDER_RADIUS_LARGE,
    margin: Layout.SPACING_LONG
  },
  searchIcon: {
    marginRight: Layout.SPACING_LONG
  },
  clearIcon: {
    marginLeft: Layout.SPACING_LONG
  },
  textInput: {
    flex: 1,
    height: 24,
    ...fontSystem.BODY
  }
});
