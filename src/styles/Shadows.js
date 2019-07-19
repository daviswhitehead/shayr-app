import colors from './Colors';

const interpolate = (
  i: number,
  a: number,
  b: number,
  a2: number,
  b2: number
) => {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
};

export const createAlternateShadow = (depth: number) => {
  // https://ethercreative.github.io/react-native-shadow-generator/
  const shadowRadiusDepthMap = [
    1,
    2,
    4,
    5,
    8,
    10,
    10,
    10,
    12,
    14,
    15,
    17,
    19,
    21,
    22,
    24,
    26,
    28,
    29,
    31,
    33,
    35,
    36,
    38
  ];

  return {
    shadowOpacity: parseFloat(
      (interpolate(depth, 1, 24, 0.2, 0.6) - 0.02).toFixed(2)
    ),
    shadowRadius: parseFloat(
      interpolate(shadowRadiusDepthMap[depth - 1], 1, 38, 1, 16).toFixed(2)
    ),
    shadowOffset: {
      height: Math.max(Math.floor(depth / 2), 1),
      width: 0
    },
    elevation: depth,
    shadowColor: colors.SHADOW
  };
};

export const createShadow = (depth: number) => ({
  shadowOpacity: 0.0015 * depth + 0.18,
  shadowRadius: 0.54 * depth,
  shadowOffset: {
    height: 0.6 * depth,
    width: 0
  },
  elevation: depth,
  shadowColor: colors.SHADOW
});
