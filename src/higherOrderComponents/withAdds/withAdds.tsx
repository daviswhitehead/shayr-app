import { documentId, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toggleAddDonePost } from '../../redux/adds/actions';
import { selectAuthUserId } from '../../redux/auth/selectors';

const mapStateToProps = (state: any) => {
  return {
    authUserId: selectAuthUserId(state),
    adds: state.adds,
    dones: state.dones
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleAddDonePost: (
      type: 'adds' | 'dones',
      isActive: boolean,
      postId: documentId,
      ownerUserId: documentId,
      userId: documentId,
      isOtherActive: boolean
    ) =>
      dispatch(
        toggleAddDonePost(
          type,
          isActive,
          postId,
          ownerUserId,
          userId,
          isOtherActive
        )
      )
  };
};

const withAdds = (
  WrappedComponent: React.SFC,
  post: UsersPosts,
  ownerUserId: documentId
) => (props: any) => {
  const {
    authUserId,
    toggleAddDonePost,
    adds,
    dones,
    ...passThroughProps
  } = props;

  const isAddsActive = _.includes(adds, post.postId);
  const isDonesActive = _.includes(dones, post.postId);

  return (
    <WrappedComponent
      isActive={isAddsActive}
      onPress={() =>
        toggleAddDonePost(
          'adds',
          isAddsActive,
          post.postId,
          ownerUserId,
          authUserId,
          isDonesActive
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
  withAdds
);
