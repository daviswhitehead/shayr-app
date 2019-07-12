import * as React from 'react';
import { Text, View } from 'react-native';
import IconWithCount from '../IconWithCount';
import UserImage from '../UserImage';
import styles from './styles';

interface UserAtom {
  facebookProfilePhoto: string;
  firstName: string;
  lastName: string;
}

export interface Props extends UserAtom {
  isVertical?: boolean;
  onPress?: () => void | undefined;
}

const UserProfile: React.SFC<Props> = ({
  facebookProfilePhoto,
  firstName,
  lastName
}: Props) => {
  return (
    <View style={styles.profileContainer}>
      <UserImage
        uri={facebookProfilePhoto}
        size='large'
        style={styles.profileImage}
      />
      <View style={styles.profileContent}>
        <Text style={styles.profileName}>
          {firstName} {lastName}
        </Text>
        <IconWithCount name={'share'} count={69} isActive={false} />
      </View>
    </View>
  );
};

export default UserProfile;
