import * as React from 'react';
import { View } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { Toaster } from '../../components/Toaster';
import {
  actionTypeActiveToasts,
  actionTypeInactiveToasts
} from '../../styles/Copy';
import Layout from '../../styles/Layout';
import Icon from '../Icon';
import styles from './styles';

const RENDER_COUNT = 0;

export interface Props {
  children: JSX.Element[] | JSX.Element;
  type: 'add' | 'done' | 'like';
  isLeftAlreadyDone?: boolean;
  leftAction?: () => void;
  isRightAlreadyDone?: boolean;
  rightAction?: () => void;
  noSwiping?: boolean;
}

export interface State {
  isLeftActive: boolean;
  isRightActive: boolean;
  triggeredLeftAction: boolean;
  leftDragDistance: number;
  triggeredRightAction: boolean;
  rightDragDistance: number;
}

class SwipeCard extends React.Component<Props, State> {
  initialState: any;
  leftActionActivationDistance: number;
  rightActionActivationDistance: number;

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
        <Icon.default
          name={this.props.type}
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
        <Icon.default
          name={'x-exit'}
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

  render() {
    console.log(`SwipeCard - Render Count: ${RENDER_COUNT}`);
    RENDER_COUNT += 1;
    console.log('this.props');
    console.log(this.props);

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

    return (
      <Swipeable
        {...swipeableOptions}
        // onSwipeComplete={() => this.setState(this.initialState)}
        // onPanAnimatedValueRef={(a: any) =>
        //   a.x.addListener(this.handleDistanceChange)
        // }
      >
        {this.props.children}
      </Swipeable>
    );
  }
}

export default SwipeCard;
