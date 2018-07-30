import { StyleSheet } from 'react-native';

import { colors } from '../../styles/Colors';

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
    // borderColor: 'red',
    // borderWidth: 1,
  },
  profileImageBox: {
    margin: 10,
  },
  profileImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  profileNameBox: {
  },
  profileName: {
  },
  contentBox: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageBox: {
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textActionsBox: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textBox: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginLeft: 20,
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
})
