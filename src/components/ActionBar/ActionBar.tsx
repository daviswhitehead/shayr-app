import { UserType } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import Icon from '../Icon';
import UserImage from '../UserImage';
import styles from './styles';

export interface Props {
  authUser: UserType;
  onAvatarPress: () => void;
  onSharePress: () => void;
  onAddPress: () => void;
  onDonePress: () => void;
  onLikePress: () => void;
  isShareActive: boolean;
  isAddActive: boolean;
  isDoneActive: boolean;
  isLikeActive: boolean;
}

const ActionBar: React.SFC<Props> = ({
  authUser,
  onAvatarPress,
  onSharePress,
  onAddPress,
  onDonePress,
  onLikePress,
  isShareActive,
  isAddActive,
  isDoneActive,
  isLikeActive
}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.actionBar}>
          <UserImage
            uri={_.get(authUser, ['facebookProfilePhoto'], '')}
            size='small'
            onPress={onAvatarPress}
            style={styles.action}
          />
          <Icon.default
            name='share'
            isActive={isShareActive}
            onPress={onSharePress}
            style={styles.action}
          />
          <Icon.default
            name='add'
            isActive={isAddActive}
            onPress={onAddPress}
            style={styles.action}
          />
          <Icon.default
            name='done'
            isActive={isDoneActive}
            onPress={onDonePress}
            style={styles.action}
          />
          <Icon.default
            name='like'
            isActive={isLikeActive}
            onPress={onLikePress}
            style={styles.action}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ActionBar;
