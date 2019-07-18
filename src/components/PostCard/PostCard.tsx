import {
  User,
  userDefault,
  UsersPosts,
  usersPostsDefault
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
// import withAdds from '../../higherOrderComponents/withAdds';
// import withDones from '../../higherOrderComponents/withDones';
import withLikes from '../../higherOrderComponents/withLikes';
import withShares from '../../higherOrderComponents/withShares';
import { selectAuthUserId } from '../../redux/auth/selectors';
import IconWithCount from '../IconWithCount';
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
}

const defaultProps = {
  authUserId: '',
  ownerUserId: '',
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

const PostCard: React.SFC<Props> = props => {
  const featuredUser = getFeaturedUser(props);

  const postImage = _.get(props, ['post', 'image'], '');

  const title = _.get(props, ['post', 'title'], '');

  const publisher = _.get(props, ['post', 'publisher', 'name'], '');
  // const timeEstimate = '23 min';
  const timeEstimate = _.get(props, ['post', 'timeEstimate'], '');

  const IconCountWithShares = withShares(
    IconWithCount,
    props.post,
    props.ownerUserId
  );
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
              noTouching={props.noTouching}
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
              <IconCountWithShares
                count={props.post.sharesCount || 0}
                name={'share'}
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
