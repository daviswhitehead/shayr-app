import colors from './Colors';

const createShadow = _elevation => ({
  shadowOpacity: 0.0015 * _elevation + 0.18,
  shadowRadius: 0.54 * _elevation,
  shadowOffset: {
    height: 0.6 * _elevation,
  },
  elevation: _elevation,
  shadowColor: colors.BLACK,
});

export default createShadow;
