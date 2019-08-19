import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleLikePost } from '../../redux/likes/actions';
import { generateListKey } from '../../redux/lists/helpers';

interface StateProps {
  authUserId: string;
  authLikes: Array<string>;
}

interface DispatchProps {
  toggleLikePost: typeof toggleLikePost;
}

interface OwnProps {
  children: (props: any) => JSX.Element[];
  ownerUserId: string;
  usersPostsId: string;
  postId: string;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state),
    authLikes: _.get(
      state,
      [
        'likesLists',
        generateListKey(selectAuthUserId(state), queryTypes.USER_LIKES),
        'items'
      ],
      []
    )
  };
};

const mapDispatchToProps = {
  toggleLikePost
};

class WithLikes extends PureComponent<Props> {
  render() {
    const {
      authUserId,
      authLikes,
      toggleLikePost,
      children,
      ownerUserId,
      usersPostsId,
      postId,
      ...passThroughProps
    } = this.props;

    const isLikesActive = _.includes(authLikes, usersPostsId);

    return this.props.children({
      isActive: isLikesActive,
      onPress: () =>
        toggleLikePost(isLikesActive, postId, ownerUserId, authUserId),
      ...passThroughProps
    });
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    areStatesEqual: (next, prev) => {
      return (
        selectAuthUserId(next) === selectAuthUserId(prev) &&
        _.get(
          next,
          [
            'likesLists',
            generateListKey(selectAuthUserId(next)!, queryTypes.USER_LIKES),
            'items'
          ],
          []
        ) ===
          _.get(
            prev,
            [
              'likesLists',
              generateListKey(selectAuthUserId(prev)!, queryTypes.USER_LIKES),
              'items'
            ],
            []
          )
      );
    }
  }
)(WithLikes);
