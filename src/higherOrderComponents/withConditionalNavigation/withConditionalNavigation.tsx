import { documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  withNavigation
} from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectAuthUserId } from '../../redux/auth/selectors';

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface StateProps {
  authUserId: string;
}

interface WithNavigationProps {
  navigation: Navigation;
}
interface OwnProps {
  userId: documentId;
}

type Props = OwnProps & StateProps & WithNavigationProps;

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state)
  };
};

const withConditionalNavigation = (
  WrappedComponent: SFC,
  route: 'MyList' | 'Friends'
) => (props: Props) => {
  const { userId, authUserId, navigation, ...passThroughProps } = props;

  const isTopLevelRoute =
    ['Discover', 'MyList', 'Friends'].indexOf(navigation.state.routeName) >=
      0 && navigation.state.key.slice(0, 3) === 'id-';

  let navigateToScreen;

  if (userId) {
    navigateToScreen = () =>
      navigation.navigate({
        routeName: `${route}`,
        params: {
          ownerUserId: userId
        },
        key: `${route}:${userId}`
      });
  }
  if (userId === authUserId) {
    navigateToScreen = isTopLevelRoute
      ? () =>
          navigation.navigate(`${route}Tab`, {
            ownerUserId: userId
          })
      : () =>
          navigation.navigate({
            routeName: `${route}`,
            params: {
              ownerUserId: userId
            },
            key: `${route}:${userId}`
          });
  }

  return <WrappedComponent onPress={navigateToScreen} {...passThroughProps} />;
};

export default compose(
  connect(
    mapStateToProps,
    undefined,
    undefined,
    {
      areStatesEqual: (next, prev) => {
        return selectAuthUserId(next) === selectAuthUserId(prev);
      }
    }
  ),
  withNavigation,
  withConditionalNavigation
);
