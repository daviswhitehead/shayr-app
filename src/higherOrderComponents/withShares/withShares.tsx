import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { SFC } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ShareModal from '../../components/ShareModal';
import * as AnalyticsDefinitions from '../../lib/AnalyticsDefinitions';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { generateListKey } from '../../redux/lists/helpers';
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
  isSwipe: boolean;
}

type Props = OwnProps & StateProps;

const mapStateToProps = (state: State) => {
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

const withShares = (WrappedComponent: SFC) => {
  return class ShareEnabled extends React.Component<Props> {
    modalRef: any;

    constructor(props: Props) {
      super(props);

      this.modalRef = React.createRef();
    }

    render() {
      const {
        authUserId,
        friends,
        ownerUserId,
        postId,
        url,
        usersPostsId,
        usersPostsShares,
        isSwipe = false,
        ...passThroughProps
      } = this.props;

      const isSharesActive = _.includes(usersPostsShares, authUserId);

      return (
        <View>
          <WrappedComponent
            isActive={isSharesActive}
            onPress={() => {
              logEvent(AnalyticsDefinitions.category.ACTION, {
                [AnalyticsDefinitions.parameters.LABEL]:
                  AnalyticsDefinitions.label.SHAYR,
                [AnalyticsDefinitions.parameters.TYPE]: isSwipe
                  ? AnalyticsDefinitions.type.SWIPE
                  : AnalyticsDefinitions.type.PRESS,
                [AnalyticsDefinitions.parameters.STATUS]:
                  AnalyticsDefinitions.status.LAUNCHED,
                [AnalyticsDefinitions.parameters.TARGET]:
                  AnalyticsDefinitions.target.APP
              });
              this.modalRef.current.toggleModal();
            }}
            {...passThroughProps}
          />
          <ShareModal
            ref={this.modalRef}
            authUserId={authUserId}
            ownerUserId={ownerUserId}
            url={url}
            usersPostsId={usersPostsId}
            postId={postId}
            users={friends}
            showInvite
            {...passThroughProps}
          />
        </View>
      );
    }
  };
};

export default compose(
  connect(
    mapStateToProps,
    undefined,
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
  withShares
);
