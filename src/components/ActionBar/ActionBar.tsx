import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { memo, SFC } from 'react';
import { SafeAreaView, View } from 'react-native';
import { IconWithAdds } from '../../higherOrderComponents/withAdds';
import { IconWithDones } from '../../higherOrderComponents/withDones';
import { IconWithLikes } from '../../higherOrderComponents/withLikes';
import { IconWithShares } from '../../higherOrderComponents/withShares';
import Icon from '../Icon';
import { names } from '../Icon';
import SmartUserAvatar from '../SmartUserAvatar';
import UserImage from '../UserImage';
import styles from './styles';

export interface Props {
  authUser: User;
  isLoading?: boolean;
  ownerUserId: string;
  postId: string;
  url: string;
  usersPostsId: string;
  usersPostsShares: Array<string>;
}

const ActionBar: SFC<Props> = ({
  authUser,
  ownerUserId,
  postId,
  isLoading,
  url,
  usersPostsId,
  usersPostsShares
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.actionBar}>
            <UserImage isLoading size={'small'} />
            <Icon isLoading name={names.SHARE} style={styles.action} />
            <Icon isLoading name={names.ADD} style={styles.action} />
            <Icon isLoading name={names.DONE} style={styles.action} />
            <Icon isLoading name={names.LIKE} style={styles.action} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.actionBar}>
          <SmartUserAvatar
            {...authUser}
            shouldHideName
            userId={authUser._id}
            style={styles.action}
          />
          <IconWithShares
            name={names.SHARE}
            style={styles.action}
            ownerUserId={ownerUserId}
            usersPostsId={usersPostsId}
            usersPostsShares={usersPostsShares}
            postId={postId}
            url={url}
          />
          <IconWithAdds
            name={names.ADD}
            style={styles.action}
            ownerUserId={ownerUserId}
            usersPostsId={usersPostsId}
            postId={postId}
          />
          <IconWithDones
            name={names.DONE}
            style={styles.action}
            ownerUserId={ownerUserId}
            usersPostsId={usersPostsId}
            postId={postId}
          />
          <IconWithLikes
            name={names.LIKE}
            style={styles.action}
            ownerUserId={ownerUserId}
            usersPostsId={usersPostsId}
            postId={postId}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default memo(ActionBar);
