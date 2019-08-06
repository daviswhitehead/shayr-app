import { documentId, UsersPosts } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleAddDonePost } from '../../redux/dones/actions';

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    activeAdds: _.get(
      state,
      ['addsLists', `${authUserId}_USER_ADDS`, 'items'],
      []
    ),
    activeDones: _.get(
      state,
      ['donesLists', `${authUserId}_USER_DONES`, 'items'],
      []
    )
    // adds: state.adds,
    // dones: state.dones
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

const withDones = (
  WrappedComponent: React.SFC,
  post: UsersPosts,
  ownerUserId: documentId
) => (props: any) => {
  const {
    authUserId,
    toggleAddDonePost,
    activeAdds,
    activeDones,
    // adds,
    // dones,
    ...passThroughProps
  } = props;

  const isAddsActive = _.includes(activeAdds, post._id);
  const isDonesActive = _.includes(activeDones, post._id);
  // const isAddsActive = _.includes(adds, post.postId);
  // const isDonesActive = _.includes(dones, post.postId);

  return (
    <WrappedComponent
      isActive={isDonesActive}
      onPress={() =>
        toggleAddDonePost(
          'dones',
          isDonesActive,
          post.postId,
          ownerUserId,
          authUserId,
          isAddsActive
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
  withDones
);
