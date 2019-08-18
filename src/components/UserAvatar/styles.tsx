import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  verticalName: {
    ...fontSystem.NAME,
    padding: Layout.SPACING_SHORT
  },
  horizontalName: {
    ...fontSystem.BODY,
    padding: Layout.SPACING_MEDIUM
  },
  selectedName: {
    ...fontSystem.BOLD_BODY,
    color: Colors.YELLOW
  },
  skeletonVertical: {
    height: 24,
    width: 24 * 2 + Layout.SPACING_LONG,
    borderRadius: Layout.BORDER_RADIUS_MEDIUM,
    marginTop: Layout.SPACING_MEDIUM
  },
  skeletonHorizontal: {
    height: 24,
    width: 24 * 4 + Layout.SPACING_LONG,
    borderRadius: Layout.BORDER_RADIUS_MEDIUM,
    marginLeft: Layout.SPACING_MEDIUM
  }
});
