import colors from './Colors';

// see appdelegate for ios font debugging
export const fonts = {
  EXTRA_BOLD: {
    fontFamily: 'NunitoSans-ExtraBold',
  },
  BOLD: {
    fontFamily: 'NunitoSans-Bold',
  },
  REGULAR: {
    fontFamily: 'NunitoSans-Regular',
  },
  LIGHT: {
    fontFamily: 'NunitoSans-Light',
  },
  EXTRA_LIGHT: {
    fontFamily: 'NunitoSans-ExtraLight',
  },
  LIGHT_ITALICS: {
    fontFamily: 'NunitoSans-LightItalic',
  },
};

export const fontSystem = {
  TITLE: {
    ...fonts.EXTRA_BOLD,
    fontSize: 24,
    color: colors.BLACK,
  },
  POST_TITLE: {
    ...fonts.EXTRA_BOLD,
    color: colors.BLACK,
    fontSize: 24,
  },
  POST_PUBLISHER: {
    ...fonts.LIGHT_ITALICS,
    color: colors.DARK_GRAY,
    fontSize: 16,
  },
  H1: {
    ...fonts.REGULAR,
    color: colors.BLACK,
    fontSize: 24,
  },
  H2: {
    ...fonts.BOLD,
    color: colors.BLACK,
    fontSize: 16,
  },
  BODY: {
    ...fonts.EXTRA_LIGHT,
    color: colors.BLACK,
    fontSize: 12,
  },
};
