import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const buttonShadow = createShadow(10);
const containerShadow = createShadow(24);

export default StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingBottom: Layout.WINDOW_BOTTOM_SAFE_AREA,
    paddingTop: Layout.WINDOW_TOP_SAFE_AREA,
    paddingHorizontal: Layout.SPACING_LONG,
    ...containerShadow
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginVertical: Layout.SPACING_LONG,
    backgroundColor: Colors.WHITE,
    borderRadius: Layout.BORDER_RADIUS_LARGE,
    borderWidth: 0.25,
    borderColor: Colors.LIGHT_GRAY
  },
  scrollViewContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: Colors.DIVIDER
  },
  commentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56
  },
  commentInput: {
    margin: Layout.SPACING_LONG,
    ...fontSystem.BODY
  },
  otherText: {
    ...fontSystem.BODY
  },
  friendsContainer: {
    margin: Layout.SPACING_LONG
  },
  otherContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginHorizontal: Layout.SPACING_LONG,
    marginVertical: Layout.SPACING_EXTRA_LONG
  },
  sectionHeader: {
    ...fontSystem.H3
  },
  touchableRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: Layout.SPACING_LONG,
    marginVertical: Layout.SPACING_MEDIUM
  },
  friendsRowText: {
    ...fontSystem.BODY,
    marginLeft: Layout.SPACING_MEDIUM
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.SPACING_LONG,
    backgroundColor: Colors.WHITE,
    borderRadius: Layout.BORDER_RADIUS_LARGE,
    height: 56,
    ...buttonShadow
  },
  shareButtonContainer: {
    backgroundColor: Colors.YELLOW,
    marginBottom: 0
  },
  button: {
    ...fontSystem.BODY_LARGE,
    marginLeft: Layout.SPACING_MEDIUM
  },
  iconStyle: {
    height: 32,
    width: 32
  },
  selected: {
    ...fontSystem.BOLD_BODY,
    color: Colors.YELLOW
  },
  centerAlign: {
    textAlign: 'center'
  }
});
