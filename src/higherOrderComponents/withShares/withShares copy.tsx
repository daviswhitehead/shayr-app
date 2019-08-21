import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { forwardRef, SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ShareModal from '../../components/ShareModal';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { State } from '../../redux/Reducers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  friends: {
    [userId: string]: User;
  };
}

interface OwnProps {
  ownerUserId: string;
  postId: string;
  url: string;
  usersPostsId: string;
  usersPostsShares: Array<string>;
  ref?: undefined;
}

type Props = OwnProps & StateProps;

const mapStateToProps = (state: State) => {
  return {
    authUserId: selectAuthUserId(state),
    friends: selectUsersFromList(
      state,
      `${selectAuthUserId(state)}_Friends`,
      true
    )
  };
};

const withShares = (WrappedComponent: SFC) =>
  forwardRef((props: Props, ref: any) => {
    const {
      authUserId,
      friends,
      ownerUserId,
      postId,
      url,
      usersPostsId,
      usersPostsShares,
      ...passThroughProps
    } = props;

    const isSharesActive = _.includes(usersPostsShares, authUserId);
    const modalRef = React.useRef(ref);
    console.log('ref');
    console.log(ref);
    console.log('modalRef');
    console.log(modalRef);

    return (
      <View>
        <WrappedComponent
          isActive={isSharesActive}
          onPress={modalRef ? () => modalRef.current.toggleModal() : null}
          {...passThroughProps}
        />
        <ShareModal
          ref={modalRef}
          authUserId={authUserId}
          ownerUserId={ownerUserId}
          payload={url}
          usersPostsId={usersPostsId}
          postId={postId}
          users={friends}
        />
      </View>
    );
  });

export default compose(
  connect(
    mapStateToProps,
    undefined,
    undefined,
    {
      areStatesEqual: (next, prev) => {
        return (
          selectAuthUserId(next) === selectAuthUserId(prev) &&
          selectUsersFromList(next, `${selectAuthUserId(next)}_Friends`) ===
            selectUsersFromList(prev, `${selectAuthUserId(prev)}_Friends`)
        );
      }
    }
  ),
  withShares
);
