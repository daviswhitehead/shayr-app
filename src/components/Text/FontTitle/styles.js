import { StyleSheet } from 'react-native';
import { fonts } from '../../../styles/Fonts';
import colors from '../../../styles/Colors';

export default StyleSheet.create({
  box: {
    textAlign: 'center',
  },
  text: {
    ...fonts.EXTRA_BOLD,
    fontSize: 24,
    color: colors.BLACK,
  },
});
