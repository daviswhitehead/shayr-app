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
  spacerContainer: {
    flex: 1.5
  },
  carouselContainer: {
    flex: 2
  },
  carouselContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
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
    flex: 1.5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: Layout.WINDOW_WIDTH * Layout.WINDOW_WIDTH_MULTIPLIER
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
