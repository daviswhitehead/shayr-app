import { User, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { IconWithCountWithLikes } from '../../higherOrderComponents/withLikes';
import { IconWithCountWithShares } from '../../higherOrderComponents/withShares';
import { names } from '../Icon';
import IconWithCount from '../IconWithCount';
import Skeleton from '../Skeleton';
import SmartUserAvatar from '../SmartUserAvatar';
import UserAvatar from '../UserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

interface Props {
  post: UsersPosts;
  onPressParameters: any;
  onPress: (parameters: any) => void | undefined;
  users?: Users;
  noTouching?: boolean;
  isLoading?: boolean;
}

class PostCard extends Component<Props> {
  static whyDidYouRender = true;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps: Props) {
    if (_.isEqual(nextProps, this.props)) {
      return false;
    }

    return true;
  }

  onPress = () => {
    this.props.onPress(this.props.onPressParameters);
  };

  unionUserIds = (post: UsersPosts) => {
    return _.union(
      _.get(post, 'shares', []),
      _.get(post, 'likes', []),
      _.get(post, 'dones', []),
      _.get(post, 'adds', [])
    );
  };

  getFeaturedUser = (userIds: Array<string>, users?: Users) => {
    if (!_.isEmpty(userIds) && !_.isEmpty(users)) {
      for (let i = 0; i < userIds.length; i++) {
        const user = _.get(users, userIds[i], {});
        if (user) {
          return user;
        }
      }
    }

    return {};
  };

  render() {
    const { post, noTouching, isLoading } = this.props;

    const currentUserIds = this.unionUserIds(post);
    const featuredUser = this.getFeaturedUser(currentUserIds, this.props.users);

    const postImage = _.get(post, 'image', '');
    const title = _.get(post, 'title', '');
    const publisher = _.get(post, ['publisher', 'name'], '');
    const timeEstimate = _.get(post, 'timeEstimate', '');

    if (isLoading) {
      return (
        <View style={styles.container}>
          {!_.isEmpty(featuredUser) ? (
            <View style={styles.avatar}>
              <UserAvatar isLoading />
            </View>
          ) : (
            <View style={styles.emptyAvatar} />
          )}
          <View style={styles.contentBox}>
            <Skeleton childStyle={styles.image} />
            <View style={styles.textActionsBox}>
              <View style={styles.textBox}>
                <Skeleton childStyle={styles.titleSkeleton} />
                <Skeleton childStyle={styles.titleSkeleton} />
              </View>
              <View style={styles.actionsBox}>
                <IconWithCount isLoading />
                <View style={styles.actionsSpacer} />
                <IconWithCount isLoading />
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={noTouching ? undefined : this.onPress}>
        <View style={styles.container}>
          {!_.isEmpty(featuredUser) ? (
            <View style={styles.avatar}>
              <SmartUserAvatar
                {...featuredUser}
                isVertical={false}
                noTouching={noTouching}
                userId={_.get(featuredUser, '_id', '')}
              />
            </View>
          ) : (
            <View style={styles.emptyAvatar} />
          )}
          <View style={styles.contentBox}>
            {!!postImage ? (
              <Image style={styles.image} source={{ uri: postImage }} />
            ) : null}
            <View style={styles.textActionsBox}>
              <View style={styles.textBox}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.subtitleBox}>
                  <Text style={styles.subtitle}>{publisher}</Text>
                  {publisher && timeEstimate ? (
                    <Text style={[styles.subtitle, styles.subtitleDivider]}>
                      {'  •  '}
                    </Text>
                  ) : null}
                  <Text style={styles.subtitle}>{timeEstimate}</Text>
                </View>
              </View>
              <View style={styles.actionsBox}>
                <IconWithCountWithShares
                  count={post.sharesCount || 0}
                  name={names.SHARE}
                  ownerUserId={post.userId}
                  usersPostsId={post._id}
                  postId={post.postId}
                  noTouching={noTouching}
                />
                <View style={styles.actionsSpacer} />
                <IconWithCountWithLikes
                  count={post.likesCount || 0}
                  name={names.LIKE}
                  ownerUserId={post.userId}
                  usersPostsId={post._id}
                  postId={post.postId}
                  noTouching={noTouching}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default PostCard;
