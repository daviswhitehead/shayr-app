import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import { fontSystem } from '../../styles/Fonts';
import Layout from '../../styles/Layout';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.YELLOW
  },
  carouselContainer: {
    flex: 1
  },
  carouselContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
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
  image: {
    resizeMode: 'contain',
    marginBottom: Layout.SPACING_LONG
  },
  title: {
    ...fontSystem.TITLE,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: Layout.SPACING_SHORT
  },
  subtitle: {
    ...fontSystem.SUBTITLE_ITALICS,
    textAlign: 'center'
  },
  paginationContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER,
    marginBottom: Layout.WINDOW_BOTTOM_SAFE_AREA + Layout.SPACING_EXTRA_LONG
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: Layout.SPACING_EXTRA_LONG
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
