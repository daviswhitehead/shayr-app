import { StyleSheet } from 'react-native';

import { colors } from '../../styles/Colors';

export default StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  imageBox: {
    width: 110,
    height: 100,
    // 70% mask
  },
  image: {
    width: 100,
    height: 100,
    // 70% mask
  },
  triangleCorner: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 30,
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    transform: [
      {rotate: '180deg'}
    ],
    paddingRight: 10,
    marginLeft: 70,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 3,
  },
  textBox: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginLeft: 0,
  },
  titlePublisherBox: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sharedByBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontWeight: 'bold',
  },
  publisherText: {
    fontWeight: 'normal',
  },
  sharedByText: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: colors.YELLOW,
  },
})
