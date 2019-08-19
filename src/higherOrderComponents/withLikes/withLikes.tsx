import _ from 'lodash';
import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleLikePost } from '../../redux/likes/actions';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems } from '../../redux/lists/selectors';

interface StateProps {
  authUserId: string;
  authLikes: Array<string>;
}

interface DispatchProps {
  toggleLikePost: typeof toggleLikePost;
}

interface OwnProps {
  ownerUserId: string;
  usersPostsId: string;
  postId: string;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state),
    authLikes: selectListItems(
      state,
      'likesLists',
      generateListKey(selectAuthUserId(state), queryTypes.USER_LIKES)
    )
  };
};

const mapDispatchToProps = {
  toggleLikePost
};

const withLikes = (WrappedComponent: SFC) => (props: Props) => {
  const {
    authUserId,
    authLikes,
    toggleLikePost,
    ownerUserId,
    usersPostsId,
    postId,
    ...passThroughProps
  } = props;

  const isLikesActive = _.includes(authLikes, usersPostsId);

  return (
    <WrappedComponent
      isActive={isLikesActive}
      onPress={() =>
        toggleLikePost(isLikesActive, postId, ownerUserId, authUserId)
      }
      {...passThroughProps}
    />
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
      areStatesEqual: (next, prev) => {
        return (
          selectAuthUserId(next) === selectAuthUserId(prev) &&
          selectListItems(
            next,
            'likesLists',
            generateListKey(selectAuthUserId(next), queryTypes.USER_LIKES)
          ) ===
            selectListItems(
              prev,
              'likesLists',
              generateListKey(selectAuthUserId(prev), queryTypes.USER_LIKES)
            )
        );
      }
    }
  ),
  withLikes
);
