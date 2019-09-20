import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';

export default StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    height: 8,
    width: 8,
    borderRadius: 8,
    backgroundColor: Colors.RED
  }
});
