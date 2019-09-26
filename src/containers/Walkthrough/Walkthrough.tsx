import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { items, setOnboardingStatus } from '../../redux/onboarding/actions';
import { State as OnboardingState } from '../../redux/onboarding/reducer';
import { State } from '../../redux/Reducers';
import Layout from '../../styles/Layout';
import styles from './styles';

interface StateProps {
  onboarding: OnboardingState;
}

interface DispatchProps {
  setOnboardingStatus: typeof setOnboardingStatus;
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface OwnState {
  carouselActiveItem: number;
  viewedCarousel: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: State) => ({
  onboarding: state.onboarding
});

const mapDispatchToProps = {
  setOnboardingStatus
};

class Walkthrough extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  carouselRef: any;
  data: Array<any>;
  constructor(props: Props) {
    super(props);

    if (this.props.onboarding.didViewIntro) {
      this.props.navigation.navigate('Login');
    }

    this.state = {
      carouselActiveItem: 0,
      viewedCarousel: false
    };

    this.carouselRef = React.createRef();
    this.data = [
      {
        title: 'Discover Together',
        subtitle:
          'Shayr makes it easy to give recommendations and discover great content within your network of close friends.',
        source: require('../../assets/images/walkthrough-discover-together.png')
      },
      {
        title: 'All the Best Content',
        subtitle:
          'Shayr works with all types of content from any of your favorite sources.',
        source: require('../../assets/images/walkthrough-best-content.png')
      },
      {
        title: 'Develop Deeper Connections',
        subtitle:
          'Get to know the people you care about better through meaningful interactions over your shared interests.',
        source: require('../../assets/images/walkthrough-deeper-connections.png')
      }
    ];
  }

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

  onContinuePress = () => {
    if (this.carouselRef && this.carouselRef.current) {
      this.carouselRef.current.snapToNext();
    }
  };

  onStartPress = () => {
    this.props.setOnboardingStatus(items.DID_VIEW_INTRO);
    this.props.navigation.navigate('Login');
  };

  render() {
    const { carouselActiveItem, viewedCarousel } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.spacerContainer} />
        <View style={styles.carouselContainer}>
          <Carousel
            ref={this.carouselRef}
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
            containerStyle={[{ paddingVertical: 0 }]} // this value needs to be explicitly set!
          />
          <PrimaryButton
            text={viewedCarousel ? 'Start' : 'Continue'}
            onPress={viewedCarousel ? this.onStartPress : this.onContinuePress}
          />
          <SecondaryButton text={'Skip'} onPress={this.onStartPress} />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Walkthrough);
