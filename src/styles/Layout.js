import { Dimensions, Platform } from 'react-native';
import { getInset } from 'react-native-safe-area-view';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const IS_LANDSCAPE = WINDOW_WIDTH > WINDOW_HEIGHT;
const WINDOW_BOTTOM_SAFE_AREA = getInset('bottom', IS_LANDSCAPE);

const layout = {
  WINDOW_WIDTH_MULTIPLIER: 0.8,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  IS_LANDSCAPE,
  WINDOW_BOTTOM_SAFE_AREA,
  WINDOW_TOP_SAFE_AREA: getInset('top', IS_LANDSCAPE),
  HEADER_HEIGHT: Platform.OS === 'ios' ? 44 : 56,
  SPACING_EXTRA_LONG: 32,
  SPACING_LONG: 16,
  SPACING_MEDIUM: 8,
  SPACING_SHORT: 4,
  BORDER_RADIUS_SMALL: 2,
  BORDER_RADIUS_MEDIUM: 4,
  BORDER_RADIUS_LARGE: 8
};

export default layout;
