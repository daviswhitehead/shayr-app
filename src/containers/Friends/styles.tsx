import { StyleSheet } from 'react-native';

import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE
  },
  testShadow: {
    height: 100,
    width: 100,
    backgroundColor: Colors.YELLOW,
    elevation: 10,
    shadowColor: Colors.RED
  }
});
