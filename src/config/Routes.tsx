import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import TabBar from '../components/TabBar';
import ComingSoon from '../containers/ComingSoon';
import Discover from '../containers/Discover';
import Friends from '../containers/Friends';
import HelloWorld from '../containers/HelloWorld';
import Login from '../containers/Login';
import MyList from '../containers/MyList';
import PostDetail from '../containers/PostDetail';
import RealtimeDataTester from '../containers/RealtimeDataTester';

const DiscoverStack = createStackNavigator({
  Discover: {
    screen: Discover,
    navigationOptions: () => ({
      header: null
    })
  },
  PostDetail: {
    screen: PostDetail,
    navigationOptions: () => ({
      header: null
    })
  },
  HelloWorld: {
    screen: HelloWorld,
    navigationOptions: () => ({
      header: null
    })
  }
});

const MyListStack = createStackNavigator({
  MyList: {
    screen: MyList,
    navigationOptions: () => ({
      header: null
    })
  },
  PostDetail: {
    screen: PostDetail,
    navigationOptions: () => ({
      header: null
    })
  },
  Settings: {
    screen: ComingSoon,
    navigationOptions: () => ({
      header: null
    })
  }
});

const FriendsStack = createStackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: () => ({
      header: null
    })
  },
  HelloWorld: {
    screen: HelloWorld,
    navigationOptions: () => ({
      header: null
    })
  },
  PostDetail: {
    screen: PostDetail,
    navigationOptions: () => ({
      header: null
    })
  }
});

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
