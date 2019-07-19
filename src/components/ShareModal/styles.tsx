import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const buttonShadow = createShadow(10);
const containerShadow = createShadow(10);
// const buttonShadow2 = createShadow2(5);

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
    ...containerShadow
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginVertical: Layout.MARGIN_LONG,
    backgroundColor: Colors.WHITE,
    borderRadius: Layout.BORDER_RADIUS_LARGE
  },
  scrollViewContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  separator: {
    height: 1,
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
    margin: Layout.MARGIN_LONG,
    ...fontSystem.BODY
  },
  friendsContainer: {
    margin: Layout.MARGIN_LONG
  },
  friendsSectionHeader: {
    ...fontSystem.H2
  },
  touchableRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: Layout.MARGIN_LONG,
    marginVertical: Layout.MARGIN_MEDIUM
  },
  friendsRowText: {
    ...fontSystem.BODY,
    marginLeft: Layout.MARGIN_MEDIUM
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.MARGIN_LONG,
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
    ...fontSystem.BODY,
    fontSize: 18,
    marginLeft: Layout.MARGIN_MEDIUM
  },
  iconStyle: {
    height: 32,
    width: 32
  },
  selected: {
    ...fontSystem.BOLD_BODY,
    color: Colors.YELLOW
  }
});
