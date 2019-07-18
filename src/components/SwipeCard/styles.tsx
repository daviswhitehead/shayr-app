import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.DARK_GRAY
  },
  activeLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity: 1,
    backgroundColor: Colors.GREEN
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.DARK_GRAY
  },
  activeRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    opacity: 1,
    backgroundColor: Colors.RED
  },
  icon: {
    position: 'absolute',
    tintColor: 'white',
    height: 56,
    width: 56
  }
});
