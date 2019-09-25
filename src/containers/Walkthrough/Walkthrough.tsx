import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import Layout from '../../styles/Layout';
import styles from './styles';

interface StateProps {}

interface DispatchProps {}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface OwnState {
  carouselActiveItem: number;
  viewedCarousel: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

class Walkthrough extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  sliderRef: any;
  data: Array<any>;
  constructor(props: Props) {
    super(props);

    this.state = {
      carouselActiveItem: 0,
      viewedCarousel: false
    };

    this.sliderRef = React.createRef();
    this.data = [
      {
        title: 'Discover Together',
        subtitle:
          'Shayr makes it easy to give recommendations and discover great content within your network of close friends.',
        source: require('../../assets/images/walkthrough-discover-together.png')
      },
      {
        title: 'Discover Together',
        subtitle:
          'Shayr makes it easy to give recommendations and discover great content within your network of close friends.',
        source: require('../../assets/images/walkthrough-discover-together.png')
      },
      {
        title: 'Discover Together',
        subtitle:
          'Shayr makes it easy to give recommendations and discover great content within your network of close friends.',
        source: require('../../assets/images/walkthrough-discover-together.png')
      }
    ];
  }

  componentDidUpdate() {}

  renderWalkthroughCard = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image source={item.source} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  renderDots = (activeIndex: number, total: number) => {
    const dots = [];
    for (let i = 0; i < total; i += 1) {
      const style =
        i === activeIndex
          ? styles.activePaginationDot
          : styles.inactivePaginationDot;
      dots.push(<View style={[styles.paginationDot, style]} key={`k_${i}`} />);
    }

    return <View style={styles.dotContainer}>{dots.map((child) => child)}</View>;
  };

  onCarouselChange = (index: number) => {
    const viewed = index === this.data.length - 1;
    this.setState((previousState) => {
      return {
        ...previousState,
        carouselActiveItem: index,
        viewedCarousel: previousState.viewedCarousel || viewed
      };
    });
  };

  render() {
    const { carouselActiveItem, viewedCarousel } = this.state;
    return (
      <View style={styles.container}>
        {/* <View> */}
        <View style={styles.carouselContainer}>
          <Carousel
            ref={this.sliderRef}
            data={this.data}
            renderItem={this.renderWalkthroughCard}
            itemWidth={Layout.WINDOW_WIDTH}
            sliderWidth={Layout.WINDOW_WIDTH}
            inactiveSlideScale={1}
            onSnapToItem={this.onCarouselChange}
            contentContainerCustomStyle={styles.carouselContentContainer}
          />
        </View>
        <View style={styles.paginationContainer}>
          <Pagination
            dotsLength={this.data.length}
            activeDotIndex={carouselActiveItem}
            renderDots={this.renderDots}
            containerStyle={{ paddingVertical: 0 }} // this value needs to be explicitly set!
          />
        </View>
      </View>
    );
  }
}

export default Walkthrough;
