import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { memo, SFC } from 'react';
import { SafeAreaView, View } from 'react-native';
import { IconWithAdds } from '../../higherOrderComponents/withAdds';
import { IconWithComments } from '../../higherOrderComponents/withComments';
import { UserAvatarWithMyListNavigation } from '../../higherOrderComponents/withConditionalNavigation';
import { IconWithDones } from '../../higherOrderComponents/withDones';
import { IconWithShares } from '../../higherOrderComponents/withShares';
import Icon from '../Icon';
import { names } from '../Icon';
import UserImage from '../UserImage';
import styles from './styles';

export interface Props {
  authUser: User;
  isLoading?: boolean;
  ownerUserId: string;
  postId: string;
  url: string;
  usersPostsId: string;
  usersPostsAdds: Array<string>;
  usersPostsComments: Array<string>;
  usersPostsDones: Array<string>;
  usersPostsShares: Array<string>;
}

const ActionBar: SFC<Props> = ({
  authUser,
  ownerUserId,
  postId,
  isLoading,
  url,
  usersPostsId,
  usersPostsAdds,
  usersPostsComments,
  usersPostsDones,
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
          <UserAvatarWithMyListNavigation
            {...authUser}
            shouldHideName
            userId={authUser._id}
            style={styles.action}
          />
          <IconWithShares
            name={names.SHARE}
            style={styles.action}
            ownerUserId={ownerUserId}
            postId={postId}
            usersPostsId={usersPostsId}
            usersPostsShares={usersPostsShares}
            url={url}
          />
          <IconWithAdds
            name={names.ADD}
            style={styles.action}
            ownerUserId={ownerUserId}
            postId={postId}
            usersPostsAdds={usersPostsAdds}
            usersPostsDones={usersPostsDones}
          />
          <IconWithDones
            // icon props
            name={names.DONE}
            style={styles.action}
            // done props
            ownerUserId={ownerUserId}
            postId={postId}
            usersPostsAdds={usersPostsAdds}
            usersPostsDones={usersPostsDones}
            // comment props
            usersPostsComments={usersPostsComments}
            // share props
            usersPostsId={usersPostsId}
            usersPostsShares={usersPostsShares}
            url={url}
          />
          <IconWithComments
            name={names.REACTION}
            style={styles.action}
            ownerUserId={ownerUserId}
            postId={postId}
            usersPostsComments={usersPostsComments}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default memo(ActionBar);
