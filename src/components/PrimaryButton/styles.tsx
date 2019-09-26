import { StyleSheet } from 'react-native';
import colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: colors.BLACK,
    padding: Layout.SPACING_LONG,
    borderRadius: Layout.BORDER_RADIUS_LARGE
  },
  text: {
    ...fontSystem.BOLD_BODY
  }
});
