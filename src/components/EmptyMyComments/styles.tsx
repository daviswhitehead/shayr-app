import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const shadow = createShadow(4);

export default StyleSheet.create({
  container: {
    marginTop: Layout.SPACING_LONG,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'stretch'
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
  image: {
    marginTop: Layout.SPACING_MEDIUM,
    resizeMode: 'contain'
  },
  shadow
});
