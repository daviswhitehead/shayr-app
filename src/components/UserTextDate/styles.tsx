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
  userImageSpacing: {
    paddingRight: Layout.SPACING_MEDIUM
  },
  boldText: {
    ...fontSystem.BOLD_BODY
  },
  text: {
    ...fontSystem.BODY
  },
  date: {
    ...fontSystem.DATE_TIMEAGO
  }
});
