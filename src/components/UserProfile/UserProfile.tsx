import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import Icon, { names } from '../Icon';
import IconWithCount from '../IconWithCount';
import Skeleton from '../Skeleton';
import UserImage from '../UserImage';
import styles from './styles';

// TODO: combine disparate UserAtom definitions
interface UserAtom {
  facebookProfilePhoto: string;
  shortName: string;
  firstName: string;
  lastName: string;
  friendsCount?: number;
}

export interface Props extends UserAtom {
  isAuth?: boolean;
  onPress?: () => void | undefined;
  isLoading?: boolean;
  friendStatus?: string;
  onFriendStatusPress?: () => void;
}

const UserProfile: SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  isAuth,
  onPress,
  isLoading,
  friendsCount = 69,
  friendStatus = '',
  onFriendStatusPress = () => console.log('onFriendStatusPress')
}: Props) => {
  const friendStatusIconMap = {
    SEND_REQUEST: names.ADD_FRIEND,
    ACCEPT_REQUEST: names.ACCEPT_FRIEND,
    AWAITING_REQUEST_ACCEPT: names.PENDING_FRIEND,
    IS_FRIENDS: names.ACCEPT_FRIEND
  };

  if (isLoading) {
    return (
      <View style={styles.profileContainer}>
        <UserImage isLoading size='large' style={styles.profileImage} />
        <View style={styles.profileContent}>
          <Skeleton childStyle={styles.skeletonProfileName} />
          <View style={styles.iconsContainer}>
            <IconWithCount isLoading />
            {isAuth && <View style={styles.actionsSpacer} />}
            {isAuth && <Icon isLoading />}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.profileContainer}>
      <UserImage
        uri={facebookProfilePhoto}
        size='large'
        style={styles.profileImage}
        onPress={onPress}
      />
      <View style={styles.profileContent}>
        <Text style={styles.profileName}>
          {firstName} {lastName}
        </Text>
        <View style={styles.iconsContainer}>
          <IconWithCount
            name={names.FRIENDS}
            count={friendsCount}
            isActive={false}
          />
          <View style={styles.actionsSpacer} />
          <Icon name={names.ADD_FRIEND} isActive={false} />
        </View>
      </View>
    </View>
  );
};

export default memo(UserProfile);
