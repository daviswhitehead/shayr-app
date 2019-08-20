import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: Layout.SPACING_LONG
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  nameDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  userImageSpacing: {
    paddingRight: Layout.SPACING_MEDIUM
  },
  boldText: {
    ...fontSystem.BOLD_BODY
  },
  text: {
    ...fontSystem.BODY
  },
  skeletonText: {
    height: 24,
    width: '100%',
    borderRadius: Layout.BORDER_RADIUS_MEDIUM,
    marginBottom: Layout.SPACING_MEDIUM
  },
  date: {
    ...fontSystem.DATE_TIMEAGO,
    marginLeft: Layout.SPACING_MEDIUM
  },
  skeletonDate: {
    height: 12,
    width: 48,
    borderRadius: Layout.BORDER_RADIUS_MEDIUM,
    marginBottom: Layout.SPACING_MEDIUM
  }
});
