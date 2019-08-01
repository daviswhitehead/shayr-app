import { documentId } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
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

export interface Props {
  authUserId: documentId;
  navigation: Navigation;
  userId: documentId;
}

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

const withNavigateToTheirList = (WrappedComponent: React.SFC) => (
  props: Props
) => {
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
    mapDispatchToProps
  ),
  withNavigation,
  withNavigateToTheirList
);
