import { Platform, StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';
import { createShadow } from '../../styles/Shadows';

const shadow = createShadow(24);

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    ...shadow,
    borderTopWidth: 0.25,
    borderTopColor: Colors.LIGHT_GRAY
  },
  safeArea: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.MARGIN_MEDIUM
  },
  action: {
    margin: Layout.MARGIN_LONG
  }
});
