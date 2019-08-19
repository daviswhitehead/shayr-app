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

interface OwnProps {
  userId: documentId;
  navigation: Navigation;
}

type Props = OwnProps & StateProps;

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state)
  };
};

const withNavigateToTheirList = (WrappedComponent: SFC) => (props: Props) => {
  const { userId, authUserId, navigation, ...passThroughProps } = props;

  const isTopLevelRoute =
    ['Discover', 'MyList', 'Friends'].indexOf(navigation.state.routeName) >=
      0 && navigation.state.key.slice(0, 3) === 'id-';

  let navigateToTheirList;

  if (userId) {
    navigateToTheirList = () =>
      navigation.navigate({
        routeName: 'MyList',
        params: {
          ownerUserId: userId
        },
        key: `MyList:${userId}`
      });
  }
  if (userId === authUserId) {
    navigateToTheirList = isTopLevelRoute
      ? () =>
          navigation.navigate('MyListTab', {
            ownerUserId: userId
          })
      : () =>
          navigation.navigate({
            routeName: 'MyList',
            params: {
              ownerUserId: userId
            },
            key: `MyList:${userId}`
          });
  }

  return (
    <WrappedComponent onPress={navigateToTheirList} {...passThroughProps} />
  );
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
  withNavigateToTheirList
);
