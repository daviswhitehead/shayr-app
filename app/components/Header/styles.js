import { StyleSheet, Platform } from 'react-native';
import layout from '../../styles/Layout';
import { fontSystem } from '../../styles/Fonts';

export default StyleSheet.create({
  container: {},
  header: {
    height: Platform.OS === 'ios' ? 44 : 56,
  },
  headerBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: layout.MARGIN_LONG,
  },
  titleBox: {
    textAlign: 'center',
  },
  title: {
    ...fontSystem.TITLE,
  },
  bookendsBox: {
    height: 24,
    width: 24,
  },
});
