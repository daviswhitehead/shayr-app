import {
  userDefault,
  usersPostsDefault,
  UsersPostsType,
  UserType
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { postAction } from '../../redux/postActions/actions';
import { handleURLRoute, postDetailsRoute } from '../../redux/routing/actions';
import IconWithCount from '../IconWithCount';
import UserAvatar from '../UserAvatar';
import styles from './styles';

interface Users {
  [userId: string]: UserType;
}

export interface Props {
  authUserId: string;
  ownerUserId: string;
  onActionPress: (actionType: string, userId: string, postId: string) => void;
  onCardPress: (url: string) => void;
  post: UsersPostsType;
  users?: Users | undefined;
  noTouching?: boolean;
}

const defaultProps = {
  authUserId: '',
  ownerUserId: '',
  onActionPress: () => null,
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
  onActionPress: (actionType: string, userId: string, postId: string) =>
    dispatch(postAction(actionType, userId, postId)),
  onCardPress: (url: string) => dispatch(handleURLRoute(url))
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

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        !props.noTouching &&
        props.onCardPress(
          postDetailsRoute(props.ownerUserId, props.post.postId)
        )
      }
    >
      <View style={styles.container}>
        {!_.isEmpty(featuredUser) ? (
          <View style={styles.avatar}>
            <UserAvatar {...featuredUser} isVertical={false} />
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
                count={props.post.shareCount || 0}
                name={'share'}
                onPress={
                  props.noTouching
                    ? undefined
                    : () =>
                        props.onActionPress(
                          'share',
                          props.authUserId,
                          props.post.postId
                        )
                }
              />
              <View style={styles.actionsSpacer} />
              <IconWithCount
                count={props.post.likeCount || 0}
                name={'like'}
                onPress={
                  props.noTouching
                    ? undefined
                    : () =>
                        props.onActionPress(
                          'like',
                          props.authUserId,
                          props.post.postId
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
