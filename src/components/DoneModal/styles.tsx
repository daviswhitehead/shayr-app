import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const containerShadow = createShadow(24);

export default StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderTopRightRadius: Layout.BORDER_RADIUS_LARGE,
    borderTopLeftRadius: Layout.BORDER_RADIUS_LARGE,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Layout.SPACING_LONG,
    paddingTop: Layout.SPACING_LONG,
    paddingBottom: Layout.WINDOW_BOTTOM_SAFE_AREA + Layout.SPACING_LONG,
    ...containerShadow
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: Layout.SPACING_MEDIUM
  },
  title: {
    ...fontSystem.H3,
    marginBottom: Layout.SPACING_MEDIUM
  },
  button: {
    ...fontSystem.BODY_LARGE,
    // ...fontSystem.BODY,
    marginLeft: Layout.SPACING_MEDIUM
  }
});
