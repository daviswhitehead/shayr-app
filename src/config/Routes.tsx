import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import TabBar from '../components/TabBar';
import Discover from '../containers/Discover';
import FindFriends from '../containers/FindFriends';
import Friends from '../containers/Friends';
import Login from '../containers/Login';
import MyList from '../containers/MyList';
import Notifications from '../containers/Notifications';
import PostDetail from '../containers/PostDetail';

const sharedRoutes = {
  PostDetail: {
    screen: PostDetail,
    navigationOptions: () => ({
      header: null
    })
  },
  MyList: {
    screen: MyList,
    navigationOptions: () => ({
      header: null
    })
  },
  Friends: {
    screen: Friends,
    navigationOptions: () => ({
      header: null
    })
  }
};

const DiscoverStack = createStackNavigator(
  {
    ...sharedRoutes,
    Discover: {
      screen: Discover,
      navigationOptions: () => ({
        header: null
      })
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: 'Discover'
  }
);

const MyListStack = createStackNavigator(
  {
    ...sharedRoutes
  },
  {
    initialRouteName: 'MyList'
  }
);

const FriendsStack = createStackNavigator(
  {
    ...sharedRoutes,
    FindFriends: {
      screen: FindFriends,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: 'Friends'
  }
);

const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: () => ({
      header: null
    })
  }
});

const TabStack = createBottomTabNavigator(
  {
    DiscoverTab: {
      screen: DiscoverStack
    },
    MyListTab: {
      screen: MyListStack
    },
    FriendsTab: {
      screen: FriendsStack
    }
  },
  {
    initialRouteName: 'DiscoverTab',
    tabBarComponent: TabBar
  }
);

const App = createAppContainer(
  createSwitchNavigator(
    {
      App: {
        screen: TabStack
      },
      Auth: {
        screen: AuthStack
      }
    },
    {
      initialRouteName: 'Auth'
    }
  )
);

export default App;
