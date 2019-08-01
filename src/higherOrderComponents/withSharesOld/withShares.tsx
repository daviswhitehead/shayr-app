import { documentId, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { queries } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleSharePost } from '../../redux/shares/actions';

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  return {
    authUserId,
    authShares: _.get(
      state,
      ['sharesLists', `${authUserId}_${queries.USER_SHARES.type}`, 'items'],
      []
    )
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleSharePost: (
      isActive: boolean,
      postId: documentId,
      ownerUserId: documentId,
      userId: documentId
    ) => dispatch(toggleSharePost(isActive, postId, ownerUserId, userId))
  };
};

const withShares = (
  WrappedComponent: React.SFC,
  post: UsersPosts,
  ownerUserId: documentId
) => (props: any) => {
  const {
    authUserId,
    toggleSharePost,
    authShares,
    ...passThroughProps
  } = props;

  const isSharesActive = _.includes(authShares, post.postId);
  return (
    <WrappedComponent
      isActive={isSharesActive}
      onPress={() =>
        toggleSharePost(isSharesActive, post.postId, ownerUserId, authUserId)
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
  withShares
);
