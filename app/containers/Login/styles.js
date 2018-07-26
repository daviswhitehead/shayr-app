import { StyleSheet } from 'react-native';

import { colors } from '../../styles/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.YELLOW,
  },
  brandContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 128,
    height: 128,
  },
  brand: {
    fontWeight: '900',
    fontSize: 60,
    paddingTop: 20,
  },
  tagline: {
    fontWeight: '100',
    fontSize: 25
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
