import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DoneModal from '../../components/DoneModal';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleAddDonePost } from '../../redux/dones/actions';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems } from '../../redux/lists/selectors';

interface StateProps {
  authUserId: string;
  authAdds: Array<string>;
  authDones: Array<string>;
}

interface DispatchProps {
  toggleAddDonePost: typeof toggleAddDonePost;
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
    authAdds: selectListItems(
      state,
      'addsLists',
      generateListKey(selectAuthUserId(state), queryTypes.USER_ADDS)
    ),
    authDones: selectListItems(
      state,
      'donesLists',
      generateListKey(selectAuthUserId(state), queryTypes.USER_DONES)
    )
  };
};

const mapDispatchToProps = {
  toggleAddDonePost
};

const withDones = (WrappedComponent: SFC) => {
  return class DoneEnabled extends React.Component<Props> {
    modalRef: any;

    constructor(props: Props) {
      super(props);

      this.modalRef = React.createRef();
    }

    render() {
      const {
        authUserId,
        authAdds,
        authDones,
        toggleAddDonePost,
        ownerUserId,
        usersPostsId,
        postId,
        ...passThroughProps
      } = this.props;

      const isAddsActive = _.includes(authAdds, usersPostsId);
      const isDonesActive = _.includes(authDones, usersPostsId);

      return (
        <View>
          <WrappedComponent
            isActive={isDonesActive}
            onPress={() => {
              if (isDonesActive) {
                toggleAddDonePost(
                  'dones',
                  isDonesActive,
                  postId,
                  ownerUserId,
                  authUserId,
                  isAddsActive
                );
              } else {
                this.modalRef.current.toggleModal();
              }
            }}
            {...passThroughProps}
          />
          <DoneModal
            ref={this.modalRef}
            onModalHide={() =>
              toggleAddDonePost(
                'dones',
                isDonesActive,
                postId,
                ownerUserId,
                authUserId,
                isAddsActive
              )
            }
            {...this.props}
          />
        </View>
      );
    }
  };
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
            'addsLists',
            generateListKey(selectAuthUserId(next), queryTypes.USER_ADDS)
          ) ===
            selectListItems(
              prev,
              'addsLists',
              generateListKey(selectAuthUserId(prev), queryTypes.USER_ADDS)
            ) &&
          selectListItems(
            next,
            'donesLists',
            generateListKey(selectAuthUserId(next), queryTypes.USER_DONES)
          ) ===
            selectListItems(
              prev,
              'donesLists',
              generateListKey(selectAuthUserId(prev), queryTypes.USER_DONES)
            )
        );
      }
    }
  ),
  withDones
);
