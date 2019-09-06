import { Notification, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import firebase from 'react-native-firebase';
import { Query } from 'react-native-firebase/firestore';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import UserTextDate from '../../components/UserTextDate';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems, selectListMeta } from '../../redux/lists/selectors';
import {
  loadNotifications,
  markNotificationAsPressed,
  markNotificationsAsRead
} from '../../redux/notifications/actions';
import { State } from '../../redux/Reducers';
import {
  selectAllUsers,
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import colors from '../../styles/Colors';
import styles from './styles';

interface StateProps {
  authUser?: User;
  authUserId: string;
  authFriends?: {
    [userId: string]: User;
  };
  notificationsData: Array<Notification>;
  notificationsListKey: string;
  notificationsMeta: {
    [ids: string]: any; // TODO: list meta type
  };
  notificationsQuery: Query;
  users?: {
    [userId: string]: User;
  };
}

interface DispatchProps {
  loadNotifications: typeof loadNotifications;
  markNotificationAsPressed: typeof markNotificationAsPressed;
  markNotificationsAsRead: typeof markNotificationsAsRead;
}

interface OwnProps {
  isFocused: boolean;
}

interface OwnState {
  isLoading: boolean;
  didView: Array<string>;
}

interface NavigationParams {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: State) => {
  const authUserId = selectAuthUserId(state);
  const authUser = selectUserFromId(state, authUserId, true);
  const authFriends = selectUsersFromList(state, `${authUserId}_Friends`, true);
  const notificationsListKey = generateListKey(
    authUserId,
    queryTypes.NOTIFICATIONS
  );

  return {
    authUserId,
    authUser,
    authFriends,
    notificationsData: selectFlatListReadyDocuments(
      state,
      'notifications',
      selectListItems(state, 'notificationsLists', notificationsListKey),
      notificationsListKey,
      'createdAt'
    ),
    notificationsListKey,
    notificationsMeta: selectListMeta(
      state,
      'notificationsLists',
      notificationsListKey
    ),
    notificationsQuery: getQuery(queryTypes.NOTIFICATIONS)(authUserId),
    users: selectAllUsers(state, true)
  };
};

const mapDispatchToProps = {
  loadNotifications,
  markNotificationAsPressed,
  markNotificationsAsRead
};

class Notifications extends Component<Props, OwnState> {
  static whyDidYouRender = true;

  subscriptions: Array<any>;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      didView: []
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    // clear notifications and badge
    firebase.notifications().removeAllDeliveredNotifications();
    firebase.notifications().setBadge(0);

    this.checkLoading();
    this.subscriptions.push(
      this.props.loadNotifications(
        this.props.notificationsListKey,
        this.props.notificationsQuery
      )
    );
  }

  componentDidUpdate(prevProps: Props) {
    this.checkLoading();
    if (
      this.props.isFocused === false &&
      prevProps.isFocused === true &&
      !_.isEmpty(this.state.didView)
    ) {
      this.props.markNotificationsAsRead(this.state.didView);
    }
  }

  componentWillUnmount() {
    Object.values(this.subscriptions).forEach((unsubscribe) => {
      if (unsubscribe) {
        unsubscribe();
      }
    });
  }

  checkLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUser &&
      this.props.authFriends &&
      this.props.notificationsMeta &&
      this.props.notificationsMeta.isLoaded
    ) {
      this.setState({ isLoading: false });
    }
  };

  onNewItems = (info: any) => {
    if (this.state.isLoading) {
      return;
    }

    const notificationIds = _.reduce(
      info.changed,
      (result, value, key) => {
        if (value.isViewable) {
          result.push(value.item._id);
        }
        return result;
      },
      []
    );

    // prevent unnecessary setStates
    if (
      !_.isEqual(
        _.intersection(this.state.didView, notificationIds),
        notificationIds
      )
    ) {
      this.setState((previousState) => ({
        ...previousState,
        didView: _.uniq([...previousState.didView, ...notificationIds])
      }));
    }
  };

  onItemPress = (item: Notification) => {
    this.props.markNotificationAsPressed(item._id);
    Linking.openURL(item.message.data.appLink);
  };

  renderItem = ({ item }: { item: Notification }) => {
    const isNotification = !_.isEmpty(item.message);

    return (
      <View
        style={isNotification && !item.isRead ? styles.unreadNotification : {}}
      >
        <UserTextDate
          isLoading={this.state.isLoading}
          user={isNotification ? this.props.users[item.fromId] : undefined}
          text={isNotification ? item.message.notification.body : undefined}
          createdAt={isNotification ? item.createdAt.toDate() : undefined}
          isNotification={isNotification}
          onPressContainer={
            isNotification ? () => this.onItemPress(item) : undefined
          }
        />
      </View>
    );
  };

  paginateList = () => {
    if (!this.props.notificationsMeta) {
      return;
    }
    this.subscriptions.push(
      this.props.loadNotifications(
        this.props.notificationsListKey,
        this.props.notificationsQuery,
        false,
        this.props.notificationsMeta.isLoading,
        this.props.notificationsMeta.lastItem
      )
    );
  };

  refreshList = () => {
    if (!this.props.notificationsMeta) {
      return;
    }
    this.subscriptions.push(
      this.props.loadNotifications(
        this.props.notificationsListKey,
        this.props.notificationsQuery,
        true,
        this.props.notificationsMeta.isLoading,
        this.props.notificationsMeta.lastItem
      )
    );
  };

  render() {
    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Notifications'
          back={() => this.props.navigation.goBack(null)}
        />
        <List
          data={this.props.notificationsData}
          renderItem={this.renderItem}
          onViewableItemsChanged={this.onNewItems}
          onEndReached={this.paginateList}
          onRefresh={this.refreshList}
          isLoading={this.state.isLoading}
          isRefreshing={
            this.state.isLoading
              ? false
              : this.props.notificationsMeta.isRefreshing
          }
          isPaginating={
            this.state.isLoading
              ? false
              : this.props.notificationsMeta.isLoading
          }
          isLoadedAll={
            this.state.isLoading
              ? false
              : this.props.notificationsMeta.isLoadedAll
          }
        />
      </View>
    );
  }
}

export default withNavigationFocus(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
      areStatePropsEqual: (next: any, prev: any) => {
        return _.isEqual(next, prev);
      }
    }
  )(Notifications)
);
