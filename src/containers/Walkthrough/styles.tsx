import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.YELLOW
  },
  carouselContainer: {
    flex: 2
  },
  carouselContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  image: {
    resizeMode: 'contain',
    marginBottom: Layout.SPACING_LONG
  },
  title: {
    ...fontSystem.TITLE,
    textAlign: 'center',
    marginBottom: Layout.SPACING_SHORT
  },
  subtitle: {
    ...fontSystem.SUBTITLE_ITALICS,
    textAlign: 'center'
  },
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER
  },
  paginationContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6
  },
  activePaginationDot: {
    backgroundColor: Colors.BLACK
  },
  inactivePaginationDot: {
    borderColor: Colors.BLACK,
    borderWidth: 1
  }
});
