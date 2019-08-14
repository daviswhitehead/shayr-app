import { documentId, User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { IconWithAdds } from '../../higherOrderComponents/withAdds';
import { IconWithDones } from '../../higherOrderComponents/withDones';
import { IconWithLikes } from '../../higherOrderComponents/withLikes';
import { IconWithShares } from '../../higherOrderComponents/withShares';
import { names } from '../Icon';
import SmartUserAvatar from '../SmartUserAvatar';
import styles from './styles';

export interface Props {
  authUser: User;
  ownerUserId: string;
  postId: string;
  usersPostsId: string;
}

const ActionBar: React.SFC<Props> = ({
  authUser,
  ownerUserId,
  usersPostsId,
  postId
}) => {
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
            postId={postId}
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

export default ActionBar;
