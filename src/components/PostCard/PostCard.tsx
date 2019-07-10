import {
  documentId,
  User,
  userDefault,
  UsersPosts,
  usersPostsDefault
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import { getActionActiveStatus } from '../../lib/StateHelpers';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  toggleLikePost,
  toggleSharePost
} from '../../redux/postActions/actions';
import IconWithCount from '../IconWithCount';
import UserAvatar from '../UserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: User;
}

export interface Props {
  authUserId: string;
  ownerUserId: string;
  toggleLikePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => void;
  toggleSharePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => void;
  onCardPress: () => void | undefined;
  post: UsersPosts;
  users?: Users | undefined;
  noTouching?: boolean;
}

const defaultProps = {
  authUserId: '',
  ownerUserId: '',
  toggleLikePost: () => null,
  onCardPress: () => null,
  post: usersPostsDefault,
  users: { a: userDefault },
  noTouching: false
};

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  toggleLikePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => dispatch(toggleLikePost(isActive, postId, ownerUserId, userId)),
  toggleSharePost: (
    isActive: boolean,
    postId: documentId,
    ownerUserId: documentId,
    userId: documentId
  ) => dispatch(toggleSharePost(isActive, postId, ownerUserId, userId))
});

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

const PostCard: React.SFC<Props> = props => {
  const featuredUser = getFeaturedUser(props);

  const postImage = _.get(props, ['post', 'image'], '');

  const title = _.get(props, ['post', 'title'], '');

  const publisher = _.get(props, ['post', 'publisher', 'name'], '');
  // const timeEstimate = '23 min';
  const timeEstimate = _.get(props, ['post', 'timeEstimate'], '');

  const isShareActive = getActionActiveStatus(
    props.authUserId,
    props.post,
    'shares'
  );
  const isLikeActive = getActionActiveStatus(
    props.authUserId,
    props.post,
    'likes'
  );

  return (
    <TouchableWithoutFeedback
      onPress={props.noTouching ? undefined : props.onCardPress}
    >
      <View style={styles.container}>
        {!_.isEmpty(featuredUser) ? (
          <View style={styles.avatar}>
            <UserAvatar
              {...featuredUser}
              isVertical={false}
              onPress={props.noTouching ? undefined : () => null}
            />
          </View>
        ) : null}
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
              <IconWithCount
                count={props.post.sharesCount || 0}
                name={'share'}
                isActive={isShareActive}
                onPress={
                  props.noTouching
                    ? undefined
                    : () =>
                        props.toggleSharePost(
                          isShareActive,
                          props.post.postId,
                          props.ownerUserId,
                          props.authUserId
                        )
                }
              />
              <View style={styles.actionsSpacer} />
              <IconWithCount
                count={props.post.likesCount || 0}
                name={'like'}
                isActive={isLikeActive}
                onPress={
                  props.noTouching
                    ? undefined
                    : () =>
                        props.toggleLikePost(
                          isLikeActive,
                          props.post.postId,
                          props.ownerUserId,
                          props.authUserId
                        )
                }
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

PostCard.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostCard);
