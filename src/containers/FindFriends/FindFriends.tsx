import { User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import FriendRequestRow from '../../components/FriendRequestRow';
import Icon, { names } from '../../components/Icon';
import SearchBar from '../../components/SearchBar';
import { queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import {
  createFriendship,
  updateFriendship
} from '../../redux/friendships/actions';
import { selectPendingFriendshipUserIds } from '../../redux/friendships/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { State } from '../../redux/Reducers';
import {
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import styles from './styles';

interface StateProps {
  authIsOwner?: boolean;
  authUser?: User;
  authUserId: string;
}

interface DispatchProps {}

interface NavigationParams {}

type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface OwnProps {
  navigation: Navigation;
}

interface OwnState {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: State) => {
  const authUserId = selectAuthUserId(state);

  return {
    authUserId,
    authUser: selectUserFromId(state, authUserId),
    pendingInitiatingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      'initiating'
    ),
    pendingReceivingFriendshipUserIds: selectPendingFriendshipUserIds(
      state,
      'receiving'
    )
  };
};

const mapDispatchToProps = {};

class Friends extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    console.log(`FindFriends - Render`);
    console.log('this.props');
    console.log(this.props);
    console.log('this.state');
    console.log(this.state);

    if (!this.props.authUser) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <SearchBar />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Friends);
