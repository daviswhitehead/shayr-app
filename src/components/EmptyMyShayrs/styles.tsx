import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const shadow = createShadow(4);

export default StyleSheet.create({
  container: {
    marginTop: Layout.SPACING_LONG,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'stretch'
  },
  block: {
    marginBottom: Layout.SPACING_LONG
  },
  shareExtensionInstructionsContainer: {
    marginTop: Layout.SPACING_SHORT,
    paddingVertical: Layout.SPACING_SHORT,
    borderBottomWidth: Layout.DIVIDER_WIDTH,
    borderBottomColor: Colors.DIVIDER,
    borderTopWidth: Layout.DIVIDER_WIDTH,
    borderTopColor: Colors.DIVIDER
  },
  listRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  enableContainer: {
    marginHorizontal: Layout.SPACING_EXTRA_LONG,
    paddingVertical: Layout.SPACING_SHORT
  },
  text: {
    textAlign: 'center',
    marginHorizontal: Layout.SPACING_LONG
  },
  listText: {
    textAlign: 'left',
    marginLeft: Layout.SPACING_EXTRA_LONG,
    marginRight: Layout.SPACING_SHORT
  },
  title: {
    ...fontSystem.H2
  },
  copy: {
    ...fontSystem.BODY
  },
  image: {
    marginTop: Layout.SPACING_MEDIUM,
    resizeMode: 'contain'
  },
  appIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  },
  moreAppIcon: {
    height: Layout.SPACING_EXTRA_LONG * 2,
    resizeMode: 'contain',
    marginRight: Layout.SPACING_LONG
  },
  enableShareImage: {
    marginLeft: Layout.SPACING_LONG,
    width: Layout.SPACING_EXTRA_LONG * 6,
    resizeMode: 'contain'
  },
  shadow
});
