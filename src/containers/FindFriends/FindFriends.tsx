import { documentIds, User } from '@daviswhitehead/shayr-resources';
import fuzzysort from 'fuzzysort';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { SectionList, Text, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationState
} from 'react-navigation';
import { connect } from 'react-redux';
import ActionRow from '../../components/ActionRow';
import FriendRequestRow from '../../components/FriendRequestRow';
import { names } from '../../components/Icon';
import SearchHeader from '../../components/SearchHeader';
import { logEvent } from '../../lib/FirebaseAnalytics';
import { queryTypes } from '../../lib/FirebaseQueries';
import { sendShayrDownloadInvite } from '../../lib/SharingHelpers';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import { selectPendingFriendshipUserIds } from '../../redux/friendships/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { State } from '../../redux/Reducers';
import { getAllUsers, getUser } from '../../redux/users/actions';
import {
  selectAllUsers,
  selectUsersFromList
} from '../../redux/users/selectors';
import styles from './styles';

const INVITE_SECTION_DATA = [
  {
    _id: 'invite',
    type: 'action',
    iconName: names.INVITE,
    copy: 'Invite your friends to join you on Shayr!',
    onPress: sendShayrDownloadInvite
    // onPress: () => logEvent('FIND_FRIENDS_INVITE_PRESSED')
  }
];

const SUGGESTED_FRIENDS_SECTION_DATA = [
  {
    _id: 'facebook-connect',
    type: 'action',
    iconName: names.FACEBOOK,
    copy: 'Find friends from Facebook already on Shayr!',
    onPress: () => logEvent('FIND_FRIENDS_FACEBOOK_CONNECT_PRESSED')
  }
];

interface StateProps {
  authIsOwner?: boolean;
  authUserId: string;
  pendingInitiatingFriendshipUserIds: Array<documentIds>;
  pendingReceivingFriendshipUserIds: Array<documentIds>;
  friendRequestUserIds: Array<documentIds>;
  friendRequestData: Array<any>;
  allUserData: Array<any>;
  suggestedFriendsData: Array<any>;
  localUsersIds: Array<documentIds>;
}

interface DispatchProps {
  getUser: typeof getUser;
  getAllUsers: typeof getAllUsers;
}

interface NavigationParams {}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface OwnProps {
  navigation: Navigation;
}

interface OwnState {
  searchText: string;
  isSearching: boolean;
  isSearchResultsEmpty: boolean;
  isFriendRequestSearchEmpty: boolean;
  isSuggestedFriendsSearchEmpty: boolean;
  isAllUsersSearchEmpty: boolean;
  filteredIds: Array<string>;
  friendRequestSectionData: Array<any>;
  suggestedFriendsSectionData: Array<any>;
  allUsersSectionData: Array<any>;
}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const mapStateToProps = (state: State) => {
  const authUserId = selectAuthUserId(state);
  const friends = selectUsersFromList(
    state,
    generateListKey(authUserId, queryTypes.USER_FRIENDS),
    'presentation'
  );
  const pendingInitiatingFriendshipUserIds = selectPendingFriendshipUserIds(
    state,
    authUserId,
    'initiating'
  );
  const pendingReceivingFriendshipUserIds = selectPendingFriendshipUserIds(
    state,
    authUserId,
    'receiving'
  );
  const friendRequestUserIds = _.pull(
    _.uniq([
      ...(pendingInitiatingFriendshipUserIds
        ? pendingInitiatingFriendshipUserIds
        : []),
      ...(pendingReceivingFriendshipUserIds
        ? pendingReceivingFriendshipUserIds
        : [])
    ]),
    authUserId
  );
  const users = selectAllUsers(state, 'presentation');
  const allUserIds = _.pullAll(_.keys(users), [
    authUserId,
    ..._.keys(friends),
    ...friendRequestUserIds
  ]);

  return {
    authUserId,
    pendingInitiatingFriendshipUserIds,
    pendingReceivingFriendshipUserIds,
    friendRequestUserIds,
    friendRequestData: selectFlatListReadyDocuments(
      state,
      'users',
      friendRequestUserIds,
      'friendRequestData',
      {
        sortKeys: ['sharesCount'],
        sortDirection: ['desc'],
        extraData: { type: 'friendRequest' },
        formatting: (user: User) => {
          return { ...user, fullName: `${user.firstName} ${user.lastName}` };
        }
      }
    ),
    allUserData: selectFlatListReadyDocuments(
      state,
      'users',
      allUserIds,
      'allUserData',
      {
        sortKeys: ['sharesCount'],
        sortDirection: ['desc'],
        extraData: { type: 'allUsers' },
        formatting: (user: User) => {
          return { ...user, fullName: `${user.firstName} ${user.lastName}` };
        }
      }
    ),
    suggestedFriendsData: SUGGESTED_FRIENDS_SECTION_DATA
  };
};

const mapDispatchToProps = {
  getUser,
  getAllUsers
};

class FindFriends extends PureComponent<Props, OwnState> {
  static whyDidYouRender = true;

  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      isSearching: false,
      isSearchResultsEmpty: false,
      isFriendRequestSearchEmpty: false,
      isSuggestedFriendsSearchEmpty: false,
      isAllUsersSearchEmpty: true,
      filteredIds: [],
      friendRequestSectionData: [],
      suggestedFriendsSectionData: [],
      allUsersSectionData: []
    };
  }

  componentDidMount() {
    this.props.getAllUsers();
  }

  componentDidUpdate() {}

  handleSearchTextEdit = (searchText: string) => {
    const friendRequestSearch = this.searchCollectionData(
      searchText,
      this.props.friendRequestData
    );
    const suggestedFriendsSearch = this.searchCollectionData(
      searchText,
      this.props.suggestedFriendsData
    );
    const allUsersSearch = this.searchCollectionData(
      searchText,
      this.props.allUserData
    );
    this.setState({
      searchText,
      isSearching: !!searchText,
      isSearchResultsEmpty:
        _.isEmpty(friendRequestSearch.searchResults) &&
        _.isEmpty(suggestedFriendsSearch.searchResults) &&
        _.isEmpty(allUsersSearch.searchResults),
      isFriendRequestSearchEmpty: _.isEmpty(friendRequestSearch.searchResults),
      isSuggestedFriendsSearchEmpty: _.isEmpty(
        suggestedFriendsSearch.searchResults
      ),
      isAllUsersSearchEmpty: _.isEmpty(allUsersSearch.searchResults),
      friendRequestSectionData: friendRequestSearch.dataWithScore,
      allUsersSectionData: allUsersSearch.dataWithScore
    });
  };

  searchCollectionData = (text: string, data: Array<any>) => {
    const searchOptions = {
      keys: ['firstName', 'lastName', 'fullName'],
      limit: 100,
      allowTypo: false
    };
    const searchOutput = fuzzysort.go(text, data, searchOptions);

    const searchResults = _.reduce(
      searchOutput,
      (result: any, value, key) => {
        _.assign(result, { [value.obj._id]: value.score });
        return result;
      },
      {}
    );
    const dataWithScore = _.reduce(
      data,
      (result: Array<any>, value, key) => {
        result.push({
          ...value,
          score: _.get(searchResults, value._id, undefined)
        });
        return result;
      },
      []
    );
    return {
      searchResults,
      dataWithScore
    };
  };

  renderItem = ({ item }: { item: any }) => {
    if (item.type === 'action') {
      return <ActionRow {...item} />;
    }

    return (
      <FriendRequestRow
        {...item}
        shouldRenderX={item.type === 'friendRequest'}
      />
    );
  };

  renderSectionHeader = ({
    section: { title }
  }: {
    section: { title: string };
  }) => {
    return <Text style={styles.sectionHeader}>{title}</Text>;
  };

  manageSectionListData = () => {
    // defaults
    let invitesSection = {
      title: 'Invite',
      data: INVITE_SECTION_DATA
    };
    let friendRequestsSection = {
      title: 'Friend Requests',
      data: this.props.friendRequestData
    };
    let suggestedFriendsSection = {
      title: 'Suggested Friends',
      data: this.props.suggestedFriendsData
    };
    let allUsersSection;

    // search logic
    if (this.state.isSearching) {
      invitesSection = this.state.isSearchResultsEmpty
        ? {
            title: 'Invite',
            data: INVITE_SECTION_DATA
          }
        : undefined;
      // invitesSection = undefined;
      friendRequestsSection = this.state.isFriendRequestSearchEmpty
        ? undefined
        : {
            title: 'Friend Requests',
            data: _.orderBy(
              _.filter(
                this.state.friendRequestSectionData,
                (o) => o.score !== undefined
              ),
              ['score'],
              ['desc']
            )
          };
      suggestedFriendsSection = this.state.isSuggestedFriendsSearchEmpty
        ? undefined
        : {
            title: 'Suggested Friends',
            data: _.orderBy(
              _.filter(
                this.state.suggestedFriendsSectionData,
                (o) => o.score !== undefined
              ),
              ['score'],
              ['desc']
            )
          };
      allUsersSection = this.state.isAllUsersSearchEmpty
        ? undefined
        : {
            title: 'All Users',
            data: _.orderBy(
              _.filter(
                this.state.allUsersSectionData,
                (o) => o.score !== undefined
              ),
              ['score'],
              ['desc']
            )
          };
    }

    if (_.isEmpty(this.props.friendRequestData)) {
      friendRequestsSection = undefined;
    }

    return _.filter(
      [
        invitesSection,
        friendRequestsSection,
        suggestedFriendsSection,
        allUsersSection
      ],
      (o) => o !== undefined
    );
  };

  keyExtractor = (item: { _id: string }) => {
    return item._id;
  };

  renderListHeader = () => {
    if (this.state.isSearchResultsEmpty && this.state.isSearching) {
      return (
        <Text style={styles.emptySearchText}>
          Sorry, we didn't find anyone matching your search!
        </Text>
      );
    }
    return;
  };

  render() {
    return (
      <View style={styles.screen}>
        <SearchHeader
          back={() => this.props.navigation.goBack(null)}
          onEdit={this.handleSearchTextEdit}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.manageSectionListData()}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderListHeader()}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    areStatePropsEqual: (next: any, prev: any) => {
      return _.isEqual(next, prev);
    }
  }
)(FindFriends);
