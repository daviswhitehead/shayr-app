import { StyleSheet } from 'react-native';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {},
  header: {
    height: Layout.HEADER_HEIGHT
  },
  headerBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Layout.SPACING_LONG
  },
  titleBox: {
    textAlign: 'center'
  },
  title: {
    ...fontSystem.TITLE
  },
  bookendsBox: {
    height: 24,
    width: 24
  },
  box: {
    textAlign: 'center'
  },
  text: {
    ...fontSystem.TITLE
  }
});
