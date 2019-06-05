import { StyleSheet } from 'react-native';

import layout from '../../styles/Layout';
import { fonts } from '../../styles/Fonts';
import colors from '../../styles/Colors';

export default class StyleSheetFactory {
  static getSheet(view) {
    let imageSize = 36;
    let direction = 'row';
    if (view === 'large') {
      imageSize = 48;
      direction = 'column';
    }
    return StyleSheet.create({
      container: {
        flexDirection: direction,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      imageBox: {
        padding: layout.PADDING_SHORT,
      },
      image: {
        height: imageSize,
        width: imageSize,
        borderRadius: imageSize / 2,
        resizeMode: 'cover',
      },
      nameBox: {
        padding: layout.PADDING_SHORT,
      },
      name: {
        ...fonts.LIGHT,
        color: colors.BLACK,
      },
    });
  }
}
