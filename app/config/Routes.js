import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation';
import ListenersLoaded from '../containers/ListenersLoaded';
import Discover from '../containers/Discover';
import MyList from '../containers/MyList';
import Login from '../containers/Login';
import PostDetail from '../containers/PostDetail';
import ComingSoon from '../containers/ComingSoon';
import TabBar from '../components/TabBar';

const DiscoverStack = createStackNavigator({
  Discover: {
    screen: Discover,
    navigationOptions: () => ({
      header: null,
    }),
  },
  PostDetail: {
    screen: PostDetail,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const MyListStack = createStackNavigator({
  MyList: {
    screen: MyList,
    navigationOptions: () => ({
      header: null,
    }),
  },
  PostDetail: {
    screen: PostDetail,
    navigationOptions: () => ({
      header: null,
    }),
  },
  Settings: {
    screen: ComingSoon,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const FriendsStack = createStackNavigator({
  ComingSoon: {
    screen: ComingSoon,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: () => ({
      header: null,
    }),
  },
});
const TabStack = createBottomTabNavigator(
  {
    Discover: DiscoverStack,
    MyList: MyListStack,
    Friends: FriendsStack,
  },
  {
    initialRouteName: 'Discover',
    tabBarComponent: TabBar,
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      ListenersLoaded,
      App: TabStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'ListenersLoaded',
    },
  ),
);
