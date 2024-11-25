import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const shadow = createShadow(8);

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    padding: Layout.SPACING_LONG,
    borderRadius: Layout.BORDER_RADIUS_LARGE,
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER,
    ...shadow
  },
  facebookContainer: {
    backgroundColor: Colors.FACEBOOK
  },
  facebookIcon: {
    color: Colors.WHITE
  },
  icon: {},
  text: {
    ...fontSystem.BOLD_BODY,
    marginLeft: Layout.SPACING_LONG,
    color: Colors.WHITE,
    textAlignVertical: 'center'
  }
});
