import { documentId } from '@daviswhitehead/shayr-resources';
import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import { IconWithCountFriendsNavigation } from '../../higherOrderComponents/withConditionalNavigation';
import { IconWithFriendshipActions } from '../../higherOrderComponents/withFriendshipActions';
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
  onPress?: () => void | undefined;
  isLoading?: boolean;
  authIsOwner: boolean;
  ownerUserId: string;
}

const UserProfile: SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  onPress,
  isLoading,
  authIsOwner,
  ownerUserId,
  friendsCount = 69
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.profileContainer}>
        <UserImage isLoading size='large' style={styles.profileImage} />
        <View style={styles.profileContent}>
          <Skeleton childStyle={styles.skeletonProfileName} />
          <View style={styles.iconsContainer}>
            <IconWithCount isLoading />
            {!authIsOwner && <View style={styles.actionsSpacer} />}
            {!authIsOwner && <Icon isLoading />}
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
          <IconWithCountFriendsNavigation
            userId={ownerUserId}
            name={names.FRIENDS}
            count={friendsCount}
            isActive={false}
          />
          {!authIsOwner && <View style={styles.actionsSpacer} />}
          {!authIsOwner && <IconWithFriendshipActions userId={ownerUserId} />}
        </View>
      </View>
    </View>
  );
};

export default memo(UserProfile);
