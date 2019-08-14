import _ from 'lodash';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { Toaster } from '../../components/Toaster';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import Layout from '../../styles/Layout';
import Icon, { names } from '../Icon';
import styles from './styles';

interface Props {
  children: JSX.Element[] | JSX.Element;
  type: 'add' | 'done' | 'like';
  isLeftAlreadyDone?: boolean;
  leftAction?: () => void;
  isRightAlreadyDone?: boolean;
  rightAction?: () => void;
  noSwiping?: boolean;
}

interface State {
  isLeftActive: boolean;
  isRightActive: boolean;
  triggeredLeftAction: boolean;
  leftDragDistance: number;
  triggeredRightAction: boolean;
  rightDragDistance: number;
}

class SwipeCard extends PureComponent<Props, State> {
  static whyDidYouRender = false;

  initialState: any;
  leftActionActivationDistance: number;
  rightActionActivationDistance: number;
  typeNameMap: any;

  constructor(props: Props) {
    super(props);

    this.initialState = {
      isLeftActive: false,
      triggeredLeftAction: false,
      leftDragDistance: 0,
      isRightActive: false,
      triggeredRightAction: false,
      rightDragDistance: 0
    };

    this.state = this.initialState;
    this.leftActionActivationDistance = 100;
    this.rightActionActivationDistance = 100;
    this.typeNameMap = {
      add: names.ADD,
      done: names.DONE,
      like: names.LIKE
    };
  }

  renderLeftContent = (leftDragDistance, isLeftActive, triggeredLeftAction) => {
    return (
      <View
        style={[
          styles.leftContainer,
          {
            opacity: Math.max(
              0.75,
              leftDragDistance / this.leftActionActivationDistance
            )
          },
          isLeftActive || triggeredLeftAction ? styles.activeLeftContainer : {}
        ]}
      >
        <Icon
          name={this.typeNameMap[this.props.type]}
          iconStyle={[
            styles.icon,
            {
              right:
                styles.icon.width * -1 - Layout.SPACING_LONG + leftDragDistance
            }
          ]}
        />
      </View>
    );
  };

  renderRightContent = (
    rightDragDistance,
    isRightActive,
    triggeredRightAction
  ) => {
    return (
      <View
        style={[
          styles.rightContainer,
          {
            opacity: Math.max(
              0.75,
              rightDragDistance / this.rightActionActivationDistance
            )
          },
          isRightActive || triggeredRightAction
            ? styles.activeRightContainer
            : {}
        ]}
      >
        <Icon
          name={names.X_EXIT}
          iconStyle={[
            styles.icon,
            {
              left:
                styles.icon.width * -1 - Layout.SPACING_LONG + rightDragDistance
            }
          ]}
        />
      </View>
    );
  };

  handleLeftRelease = () => {
    if (this.state.isLeftActive) {
      if (this.props.isLeftAlreadyDone) {
        Toaster(actionTypeActiveToasts[`${this.props.type}s`]);
      } else {
        this.props.leftAction();
      }
      this.setState({ triggeredLeftAction: true });
    }
  };

  handleRightRelease = () => {
    if (this.state.isRightActive) {
      if (this.props.isRightAlreadyDone) {
        Toaster(actionTypeInactiveToasts[`${this.props.type}s`]);
      } else {
        this.props.rightAction();
      }
      this.setState({ triggeredRightAction: true });
    }
  };

  handleDistanceChange = (e: any) => {
    const distance = e.value;

    if (distance > 0) {
      this.setState({ leftDragDistance: distance });
    }
    if (distance < 0) {
      this.setState({ rightDragDistance: distance * -1 });
    }
  };

  // shouldComponentUpdate(nextProps: Props, nextState: State) {
  //   // implement if performance is bad with constant re-renders
  //   // the lines below will break holding the icon in a constant place on the screen :(
  //   if (
  //     _.isEqual(nextProps, this.props) &&
  //     _.isEqual(
  //       _.omit(nextState, ['leftDragDistance', 'rightDragDistance']),
  //       _.omit(this.state, ['leftDragDistance', 'rightDragDistance'])
  //     )
  //   ) {
  //     return false;
  //   }

  //   return true;
  // }

  render() {
    const {
      isLeftActive,
      leftDragDistance,
      triggeredLeftAction,
      isRightActive,
      rightDragDistance,
      triggeredRightAction
    } = this.state;
    const { leftAction, rightAction, noSwiping } = this.props;

    let swipeableOptions = {};
    if (!noSwiping) {
      // baseline props
      swipeableOptions = {
        onSwipeComplete: () => this.setState(this.initialState),
        onPanAnimatedValueRef: (a: any) =>
          a.x.addListener(this.handleDistanceChange)
      };

      // left
      if (leftAction) {
        swipeableOptions = {
          ...swipeableOptions,
          leftContent: this.renderLeftContent(
            leftDragDistance,
            isLeftActive,
            triggeredLeftAction
          ),
          leftActionActivationDistance: this.leftActionActivationDistance,
          onLeftActionActivate: () => this.setState({ isLeftActive: true }),
          onLeftActionDeactivate: () => this.setState({ isLeftActive: false }),
          onLeftActionRelease: this.handleLeftRelease
        };
      }

      // right
      if (rightAction) {
        swipeableOptions = {
          ...swipeableOptions,
          rightContent: this.renderRightContent(
            rightDragDistance,
            isRightActive,
            triggeredRightAction
          ),
          rightActionActivationDistance: this.rightActionActivationDistance,
          onRightActionActivate: () => this.setState({ isRightActive: true }),
          onRightActionDeactivate: () =>
            this.setState({ isRightActive: false }),
          onRightActionRelease: this.handleRightRelease
        };
      }
    }

    return <Swipeable {...swipeableOptions}>{this.props.children}</Swipeable>;
  }
}

export default SwipeCard;
