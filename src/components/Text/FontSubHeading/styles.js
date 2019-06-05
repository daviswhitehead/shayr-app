import { StyleSheet } from 'react-native';
import { fonts } from '../../../styles/Fonts';
import colors from '../../../styles/Colors';

export default StyleSheet.create({
  box: {
    textAlign: 'left',
  },
  text: {
    ...fonts.LIGHT_ITALICS,
    color: colors.DARK_GRAY,
    fontSize: 14,
  },
});
