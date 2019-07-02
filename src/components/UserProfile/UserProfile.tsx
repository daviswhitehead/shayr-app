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

const UserProfile: React.SFC<Props> = ({  }: Props) => {
  return (
    <View style={styles.profileContainer}>
      <UserImage uri='' size='large' style={styles.profileImage} />
      <View style={styles.profileContent}>
        <Text style={styles.profileName}>Susan Altonabello</Text>
        <IconWithCount name={'share'} count={35} isActive={false} />
      </View>
    </View>
  );
};

export default UserProfile;
