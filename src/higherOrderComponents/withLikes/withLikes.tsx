import { documentId, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleLikePost } from '../../redux/likes/actions';

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state),
    likes: state.likes
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleLikePost: (
      isActive: boolean,
      postId: documentId,
      ownerUserId: documentId,
      userId: documentId
    ) => dispatch(toggleLikePost(isActive, postId, ownerUserId, userId))
  };
};

const withLikes = (
  WrappedComponent: React.SFC,
  post: UsersPosts,
  ownerUserId: documentId
) => (props: any) => {
  const { authUserId, toggleLikePost, likes, ...passThroughProps } = props;

  const isLikesActive = _.includes(likes, post.postId);
  // const isDonesActive = getActionActiveStatus(authUserId, post, 'dones');

  return (
    <WrappedComponent
      isActive={isLikesActive}
      onPress={() =>
        toggleLikePost(isLikesActive, post.postId, ownerUserId, authUserId)
      }
      {...passThroughProps}
    />
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLikes
);
