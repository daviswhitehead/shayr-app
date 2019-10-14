import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DoneModal from '../../components/DoneModal';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { toggleAddDonePost } from '../../redux/dones/actions';
import { generateListKey } from '../../redux/lists/helpers';
import { selectUsersFromList } from '../../redux/users/selectors';

interface StateProps {
  authUserId: string;
  friends?: {
    [userId: string]: User;
  };
}

interface DispatchProps {
  toggleAddDonePost: typeof toggleAddDonePost;
}

interface OwnProps {
  ownerUserId: string;
  postId: string;
  usersPostsAdds: Array<string>;
  usersPostsDones: Array<string>;
  isSwipe: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: any) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    friends: selectUsersFromList(
      state,
      generateListKey(authUserId, queryTypes.USER_FRIENDS),
      'presentation'
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
        usersPostsAdds,
        usersPostsDones,
        friends = [],
        toggleAddDonePost,
        ownerUserId,
        postId,
        isSwipe = false,
        ...passThroughProps
      } = this.props;

      const isAddsActive = _.includes(usersPostsAdds, authUserId);
      const isDonesActive = _.includes(usersPostsDones, authUserId);

      return (
        <View>
          <WrappedComponent
            isActive={isDonesActive}
            onPress={() => {
              if (isDonesActive) {
                logEvent(AnalyticsDefinitions.category.ACTION, {
                  [AnalyticsDefinitions.parameters.LABEL]:
                    AnalyticsDefinitions.label.REMOVE_DONE,
                  [AnalyticsDefinitions.parameters.TYPE]: isSwipe
                    ? AnalyticsDefinitions.type.SWIPE
                    : AnalyticsDefinitions.type.PRESS
                });
                toggleAddDonePost(
                  'dones',
                  isDonesActive,
                  postId,
                  ownerUserId,
                  authUserId,
                  isAddsActive,
                  _.keys(friends)
                );
              } else {
                logEvent(AnalyticsDefinitions.category.ACTION, {
                  [AnalyticsDefinitions.parameters.LABEL]:
                    AnalyticsDefinitions.label.MARK_AS_DONE,
                  [AnalyticsDefinitions.parameters.TYPE]: isSwipe
                    ? AnalyticsDefinitions.type.SWIPE
                    : AnalyticsDefinitions.type.PRESS,
                  [AnalyticsDefinitions.parameters.STATUS]:
                    AnalyticsDefinitions.status.START
                });
                this.modalRef.current.toggleModal();
              }
            }}
            {...passThroughProps}
          />
          <DoneModal
            ref={this.modalRef}
            onModalHide={() => {
              logEvent(AnalyticsDefinitions.category.ACTION, {
                [AnalyticsDefinitions.parameters.LABEL]:
                  AnalyticsDefinitions.label.MARK_AS_DONE,
                [AnalyticsDefinitions.parameters.TYPE]: isSwipe
                  ? AnalyticsDefinitions.type.SWIPE
                  : AnalyticsDefinitions.type.PRESS,
                [AnalyticsDefinitions.parameters.STATUS]:
                  AnalyticsDefinitions.status.SUCCESS
              });
              toggleAddDonePost(
                'dones',
                isDonesActive,
                postId,
                ownerUserId,
                authUserId,
                isAddsActive,
                _.keys(friends)
              );
            }}
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
        const prevAuthUserId = selectAuthUserId(prev);
        const nextAuthUserId = selectAuthUserId(prev);

        return (
          nextAuthUserId === prevAuthUserId &&
          selectUsersFromList(
            next,
            generateListKey(nextAuthUserId, queryTypes.USER_FRIENDS),
            'presentation'
          ) ===
            selectUsersFromList(
              prev,
              generateListKey(prevAuthUserId, queryTypes.USER_FRIENDS),
              'presentation'
            )
        );
      }
    }
  ),
  withDones
);
