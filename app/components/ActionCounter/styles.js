import { StyleSheet } from 'react-native';

import { colors } from '../../styles/Colors';
import { layout } from '../../styles/Layout';
import { fonts } from '../../styles/Fonts';

export default StyleSheet.create({
  container: {
    padding: layout.PADDING,
  },
  icon: {
    height: 24,
    width: 24,
  },
  count: {
    ...fonts.LIGHT,
  },
  iconLoading: {
    height: 24,
    width: 24,
    backgroundColor: colors.GRAY,
  },
})
