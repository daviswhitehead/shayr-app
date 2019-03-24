import { StyleSheet } from 'react-native';

import colors from '../../styles/Colors';
import layout from '../../styles/Layout';
import { fonts } from '../../styles/Fonts';

export default StyleSheet.create({
  cardBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headerBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: layout.MARGIN_MEDIUM,
  },
  profileImageBox: {
    padding: layout.PADDING_MEDIUM,
  },
  profileImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  profileNameBox: {
    padding: layout.PADDING_MEDIUM,
  },
  profileName: {
    ...fonts.LIGHT,
    color: 'black',
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: layout.MARGIN_MEDIUM,
  },
  imageBox: {
    padding: layout.PADDING_MEDIUM,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textActionsBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: layout.PADDING_MEDIUM,
  },
  textBox: {
    flex: 100,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  titleText: {
    ...fonts.BOLD,
    color: 'black',
  },
  publisherText: {
    ...fonts.LIGHT_ITALICS,
    color: 'grey',
  },
  actionsBox: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  action: {
    padding: layout.PADDING_MEDIUM,
  },
  actionImage: {
    height: 24,
    width: 24,
  },
});
