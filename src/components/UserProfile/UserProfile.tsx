import React, { memo, SFC } from 'react';
import { Text, View } from 'react-native';
import { names } from '../Icon';
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
}

export interface Props extends UserAtom {
  onPress?: () => void | undefined;
  isLoading?: boolean;
}

const UserProfile: SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName,
  onPress,
  isLoading
}: Props) => {
  if (isLoading) {
    return (
      <View style={styles.profileContainer}>
        <UserImage isLoading size='large' style={styles.profileImage} />
        <View style={styles.profileContent}>
          <Skeleton childStyle={styles.skeletonProfileName} />
          <IconWithCount isLoading />
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
        <IconWithCount name={names.FRIENDS} count={69} isActive={false} />
      </View>
    </View>
  );
};

export default memo(UserProfile);
