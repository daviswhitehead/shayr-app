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
  type: 'adds' | 'dones' | 'likes' | 'shares' | 'comments';
  isLeftAlreadyDone?: boolean;
  leftAction?: (renderFunction: any) => void;
  leftActionProps?: any;
  isRightAlreadyDone?: boolean;
  rightAction?: (renderFunction: any) => void;
  rightActionProps?: any;
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
  leftAction: any;
  leftActionFunction: any;
  rightAction: any;
  rightActionFunction: any;

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
      adds: names.ADD,
      dones: names.DONE,
      likes: names.LIKE,
      shares: names.SHARE,
      comments: names.REACTION
    };

    this.leftAction = this.props.leftAction
      ? this.props.leftAction(this.renderAction)
      : undefined;
    this.leftActionFunction = undefined;
    this.rightAction = this.props.rightAction
      ? this.props.rightAction(this.renderAction)
      : undefined;
    this.rightActionFunction = undefined;
  }

  renderAction = ({
    side,
    onPress
  }: {
    side: 'left' | 'right';
    onPress: () => void;
  }) => {
    if (side === 'left') {
      this.leftActionFunction = onPress;
    } else if (side === 'right') {
      this.rightActionFunction = onPress;
    }

    return <View />;
  };

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
            },
            leftDragDistance > 0 ? {} : { tintColor: 'transparent' }
          ]}
        />
        {this.leftAction && <this.leftAction {...this.props.leftActionProps} />}
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
            },
            rightDragDistance > 0 ? {} : { tintColor: 'transparent' }
          ]}
        />
        {this.rightAction && (
          <this.rightAction {...this.props.rightActionProps} />
        )}
      </View>
    );
  };

  handleLeftRelease = () => {
    if (this.state.isLeftActive) {
      if (this.props.isLeftAlreadyDone) {
        Toaster(actionTypeActiveToasts[this.props.type]);
      } else {
        this.leftActionFunction && this.leftActionFunction();
      }
      this.setState({ triggeredLeftAction: true });
    }
  };

  handleRightRelease = () => {
    if (this.state.isRightActive) {
      if (this.props.isRightAlreadyDone) {
        Toaster(actionTypeInactiveToasts[this.props.type]);
      } else {
        this.rightActionFunction && this.rightActionFunction();
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
    // console.log(`SwipeCard - Render`);
    // console.log('this.props');
    // console.log(this.props);
    // console.log('this.state');
    // console.log(this.state);
    // console.log('this.leftAction');
    // console.log(this.leftAction);
    // console.log('this.leftActionFunction');
    // console.log(this.leftActionFunction);
    // console.log('this.rightAction');
    // console.log(this.rightAction);
    // console.log('this.rightActionFunction');
    // console.log(this.rightActionFunction);

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
