import { StyleSheet } from 'react-native';

import { colors } from '../../styles/Colors';
import { layout } from '../../styles/Layout';

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
    marginLeft: layout.MARGINLEFT,
  },
  profileImageBox: {
    padding: layout.PADDING,
  },
  profileImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  profileNameBox: {
    padding: layout.PADDING,
  },
  profileName: {
  },
  contentBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: layout.MARGINLEFT,
  },
  imageBox: {
    padding: layout.PADDING,

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
    padding: layout.PADDING,
  },
  textBox: {
    flex: 100,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  titleText: {
    fontWeight: 'bold',
  },
  publisherText: {
    fontWeight: 'normal',
  },
  actionsBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  action: {
    padding: layout.PADDING,
  },
})
