import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const shadow = createShadow(6);

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginTop: Layout.SPACING_LONG
  },
  block: {
    marginBottom: Layout.SPACING_LONG
  },
  text: {
    textAlign: 'center',
    marginHorizontal: Layout.SPACING_LONG
  },
  title: {
    ...fontSystem.H2
  },
  copy: {
    ...fontSystem.BODY
  },
  button: {
    backgroundColor: Colors.YELLOW,
    borderWidth: 0,
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER,
    alignSelf: 'center',
    ...shadow
  }
});
