import { documentId, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleLikePost } from '../../redux/likes/actions';

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    activeLikes: _.get(
      state,
      ['likesLists', `${authUserId}_USER_LIKES`, 'items'],
      []
    )
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
  const {
    authUserId,
    toggleLikePost,
    activeLikes,
    noTouching,
    ...passThroughProps
  } = props;

  const isLikesActive = _.includes(activeLikes, post._id);

  return (
    <WrappedComponent
      isActive={isLikesActive}
      onPress={
        noTouching
          ? null
          : () =>
              toggleLikePost(
                isLikesActive,
                post.postId,
                ownerUserId,
                authUserId
              )
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
