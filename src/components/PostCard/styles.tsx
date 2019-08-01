import { StyleSheet } from 'react-native';
import colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: Layout.SPACING_MEDIUM,
    paddingBottom: Layout.SPACING_LONG,
    paddingTop: Layout.SPACING_MEDIUM
  },
  avatar: {
    marginHorizontal: Layout.SPACING_MEDIUM,
    marginBottom: Layout.SPACING_MEDIUM
  },
  emptyAvatar: {
    marginBottom: Layout.SPACING_MEDIUM
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: Layout.SPACING_MEDIUM
  },
  image: {
    width: 104,
    height: 104,
    borderRadius: Layout.BORDER_RADIUS_LARGE,
    marginRight: Layout.SPACING_MEDIUM,
    resizeMode: 'cover'
  },
  textActionsBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: Layout.SPACING_MEDIUM
  },
  textBox: {
    flexDirection: 'column'
  },
  actionsBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginTop: Layout.SPACING_MEDIUM
  },
  title: {
    ...fontSystem.H2
  },
  titleSkeleton: {
    height: 24,
    width: '100%',
    borderRadius: Layout.BORDER_RADIUS_MEDIUM,
    marginBottom: Layout.SPACING_MEDIUM
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
    width: Layout.SPACING_LONG
  }
});
