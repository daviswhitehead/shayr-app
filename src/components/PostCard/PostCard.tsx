import {
  User,
  userDefault,
  UsersPosts,
  usersPostsDefault
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { connect } from 'react-redux';
// import withAdds from '../../higherOrderComponents/withAdds';
// import withDones from '../../higherOrderComponents/withDones';
import withLikes from '../../higherOrderComponents/withLikes';
import { IconWithCountWithShares } from '../../higherOrderComponents/withShares';
import { selectAuthUserId } from '../../redux/auth/selectors';
import Colors from '../../styles/Colors';
import IconWithCount from '../IconWithCount';
import SmartUserAvatar from '../SmartUserAvatar';
import UserAvatar from '../UserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

export interface Props {
  authUserId: string;
  ownerUserId: string;
  onCardPress: () => void | undefined;
  post: UsersPosts;
  users?: Users | undefined;
  noTouching?: boolean;
  isLoading?: boolean;
}

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

const getFeaturedUser = (props: Props) => {
  const eligibleFeaturedUserIds: Array<string> = _.union(
    _.get(props, ['post', 'shares'], []),
    _.get(props, ['post', 'likes'], []),
    _.get(props, ['post', 'dones'], []),
    _.get(props, ['post', 'adds'], [])
  );

  for (let i = 0; i < eligibleFeaturedUserIds.length; i++) {
    const user = _.get(props, ['users', eligibleFeaturedUserIds[i]], {});
    if (user) {
      return user;
    }
  }
};

const PostCard: React.SFC<Props> = (props) => {
  const featuredUser = getFeaturedUser(props);

  const postImage = _.get(props, ['post', 'image'], '');
  const title = _.get(props, ['post', 'title'], '');
  const publisher = _.get(props, ['post', 'publisher', 'name'], '');
  const timeEstimate = _.get(props, ['post', 'timeEstimate'], '');

  const IconCountWithLikes = withLikes(
    IconWithCount,
    props.post,
    props.ownerUserId
  );

  // const IconCountWithAdds = withAdds(
  //   IconWithCount,
  //   props.post,
  //   props.ownerUserId
  // );

  // const IconCountWithDones = withDones(
  //   IconWithCount,
  //   props.post,
  //   props.ownerUserId
  // );

  if (props.isLoading) {
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
          <SkeletonPlaceholder backgroundColor={Colors.SKELETON}>
            <View style={styles.image} />
          </SkeletonPlaceholder>
          <View style={styles.textActionsBox}>
            <View style={styles.textBox}>
              <SkeletonPlaceholder backgroundColor={Colors.SKELETON}>
                <View style={styles.titleSkeleton} />
              </SkeletonPlaceholder>
              <SkeletonPlaceholder backgroundColor={Colors.SKELETON}>
                <View style={styles.titleSkeleton} />
              </SkeletonPlaceholder>
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
    <TouchableWithoutFeedback
      onPress={props.noTouching ? undefined : props.onCardPress}
    >
      <View style={styles.container}>
        {!_.isEmpty(featuredUser) ? (
          <View style={styles.avatar}>
            <SmartUserAvatar
              {...featuredUser}
              isVertical={false}
              noTouching={props.noTouching}
              userId={featuredUser._id}
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
                count={props.post.sharesCount || 0}
                name={'share'}
                usersPost={props.post}
                ownerUserId={props.post.userId}
                noTouching={props.noTouching}
              />
              <View style={styles.actionsSpacer} />
              {/* <IconCountWithAdds
                count={props.post.addsCount || 0}
                name={'add'}
              />
              <View style={styles.actionsSpacer} />
              <IconCountWithDones
                count={props.post.donesCount || 0}
                name={'done'}
              />
              <View style={styles.actionsSpacer} /> */}
              <IconCountWithLikes
                count={props.post.likesCount || 0}
                name={'like'}
                noTouching={props.noTouching}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

PostCard.defaultProps = {
  authUserId: '',
  ownerUserId: '',
  onCardPress: () => null,
  post: usersPostsDefault,
  users: { a: userDefault },
  noTouching: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostCard);
