import { StyleSheet } from 'react-native';

import { colors } from '../../styles/Colors';
import { layout } from '../../styles/Layout';
import { fonts } from '../../styles/Fonts';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  count: {
    ...fonts.BOLD,
    color: colors.YELLOW,
    padding: layout.PADDING,
    fontSize: 16,
  },
  iconLoading: {
    height: 16,
    width: 16,
    backgroundColor: colors.GRAY,
  },
})
