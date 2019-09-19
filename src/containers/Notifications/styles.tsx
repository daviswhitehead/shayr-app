import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Stylesheet from '../../styles/Stylesheet';

export default StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  notificationRow: {
    ...Stylesheet.row,
    padding: 0
  },
  unreadNotification: {
    backgroundColor: Colors.BLUE20
  }
});
