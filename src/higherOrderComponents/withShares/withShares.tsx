import { documentId, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleSharePost } from '../../redux/shares/actions';

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state),
    shares: state.shares
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
  const { authUserId, toggleSharePost, shares, ...passThroughProps } = props;

  const isSharesActive = _.includes(shares, post.postId);
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
