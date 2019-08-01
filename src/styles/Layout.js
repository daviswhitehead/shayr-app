import { Dimensions } from 'react-native';
import { getInset } from 'react-native-safe-area-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const landScape = width > height;

const layout = {
  WINDOW_WIDTH_MULTIPLIER: 0.8,
  WINDOW_WIDTH: width,
  WINDOW_HEIGHT: height,
  WINDOW_BOTTOM_SAFE_AREA: getInset('bottom', landScape),
  WINDOW_TOP_SAFE_AREA: getInset('top', landScape),
  SPACING_EXTRA_LONG: 32,
  SPACING_LONG: 16,
  SPACING_MEDIUM: 8,
  SPACING_SHORT: 4,
  BORDER_RADIUS_SMALL: 2,
  BORDER_RADIUS_MEDIUM: 4,
  BORDER_RADIUS_LARGE: 8
};

export default layout;
