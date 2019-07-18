import { StyleSheet } from 'react-native';
import colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: layout.MARGIN_MEDIUM,
    paddingBottom: layout.PADDING_LONG,
    paddingTop: layout.PADDING_MEDIUM
  },
  avatar: {
    marginHorizontal: layout.MARGIN_MEDIUM,
    marginBottom: layout.MARGIN_MEDIUM
  },
  emptyAvatar: {
    marginBottom: layout.MARGIN_MEDIUM
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: layout.MARGIN_MEDIUM
  },
  image: {
    width: 104,
    height: 104,
    borderRadius: layout.BORDER_RADIUS_LARGE,
    marginRight: layout.MARGIN_MEDIUM,
    resizeMode: 'cover'
  },
  textActionsBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: layout.PADDING_MEDIUM
  },
  textBox: {
    flexDirection: 'column'
  },
  actionsBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginTop: layout.MARGIN_MEDIUM
  },
  title: {
    ...fontSystem.H2
  },
  subtitleBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  subtitle: {
    ...fontSystem.SUBTITLE
  },
  subtitleDivider: {
    color: colors.BLACK
  },
  actionsSpacer: {
    width: layout.MARGIN_LONG
  }
});
