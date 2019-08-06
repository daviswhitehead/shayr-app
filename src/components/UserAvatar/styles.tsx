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
  }
});
