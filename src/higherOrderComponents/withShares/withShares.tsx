import _ from 'lodash';
import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ShareModal from '../../components/ShareModal';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectUsersFromList } from '../../redux/users/selectors';

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);
  return {
    authUserId,
    authShares: _.get(
      state,
      [
        'sharesLists',
        generateListKey(authUserId, queryTypes.USER_SHARES),
        'items'
      ],
      []
    ),
    friends: selectUsersFromList(state, `${authUserId}_Friends`)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const withShares = (WrappedComponent: React.SFC) => (props: any) => {
  const {
    authUserId,
    authShares,
    friends,
    usersPost,
    ownerUserId,
    noTouching,
    ...passThroughProps
  } = props;

  const isSharesActive = _.includes(authShares, usersPost.postId);
  const modalRef = React.useRef(null);

  return (
    <View>
      <WrappedComponent
        isActive={isSharesActive}
        onPress={
          modalRef && !noTouching ? () => modalRef.current.toggleModal() : null
        }
        {...passThroughProps}
      />
      <ShareModal
        ref={modalRef}
        authUserId={authUserId}
        ownerUserId={ownerUserId}
        payload={usersPost.url}
        url={usersPost.url}
        post={usersPost}
        postId={usersPost.postId}
        users={friends}
        // navigateToLogin={() => navigateToLogin()}
      />
    </View>
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withShares
);
