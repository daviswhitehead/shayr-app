import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { memo, SFC } from 'react';
import { ScrollView, View } from 'react-native';
import { UserAvatarWithNavigateToTheirList } from '../../higherOrderComponents/withNavigateToTheirList';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

export interface Props {
  users: Users;
}

const UserAvatarsScrollView: SFC<Props> = ({ users }: Props) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {_.reduce(
        users,
        (result: Array<JSX.Element>, value: any, key: string) => {
          result.push(
            <View style={styles.avatarContainer} key={key}>
              <UserAvatarWithNavigateToTheirList
                {...value}
                userId={value._id}
              />
            </View>
          );
          return result;
        },
        []
      )}
    </ScrollView>
  );
};

export default memo(UserAvatarsScrollView);
