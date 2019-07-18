import * as React from 'react';
import { Text } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  withNavigation
} from 'react-navigation';
import { connect } from 'react-redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import TouchableWrapper from '../TouchableWrapper';
import UserImage from '../UserImage';
import styles from './styles';

interface UserAtom {
  facebookProfilePhoto: string;
  firstName?: string;
  lastName?: string;
  _id?: string;
}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

export interface Props extends UserAtom {
  authUserId: string;
  navigation: Navigation;
  isVertical?: boolean;
  onPress?: () => void | undefined;
  noTouching?: boolean;
}

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

const UserAvatar: React.SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  isVertical = true,
  onPress,
  _id,
  authUserId,
  noTouching,
  navigation
}: Props) => {
  const isTopLevelRoute =
    ['Discover', 'MyList', 'Friends'].indexOf(navigation.state.routeName) >=
      0 && navigation.state.key.slice(0, 3) === 'id-';

  let navigateToTheirList;

  if (_id) {
    navigateToTheirList = () =>
      navigation.navigate({
        routeName: 'MyList',
        params: {
          ownerUserId: _id
        },
        key: `MyList:${_id}`
      });
  }
  if (_id === authUserId) {
    navigateToTheirList = isTopLevelRoute
      ? () =>
          navigation.navigate('MyListTab', {
            ownerUserId: _id
          })
      : () =>
          navigation.navigate({
            routeName: 'MyList',
            params: {
              ownerUserId: _id
            },
            key: `MyList:${_id}`
          });
  }

  return (
    <TouchableWrapper
      style={[
        styles.container,
        { flexDirection: isVertical ? 'column' : 'row' }
      ]}
      onPress={noTouching ? undefined : onPress || navigateToTheirList}
    >
      <UserImage uri={facebookProfilePhoto} size='small' />
      {firstName && lastName ? (
        <Text style={isVertical ? styles.verticalName : styles.horizontalName}>
          {isVertical
            ? `${firstName} ${lastName.charAt(0)}`
            : `${firstName} ${lastName}`}
        </Text>
      ) : null}
    </TouchableWrapper>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(UserAvatar));
