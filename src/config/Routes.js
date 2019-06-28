import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';
import Discover from '../containers/Discover';
import MyList from '../containers/MyList';
import Login from '../containers/Login';
import PostDetail from '../containers/PostDetail';
import ComingSoon from '../containers/ComingSoon';
import Friends from '../containers/Friends';
import RealtimeDataTester from '../containers/RealtimeDataTester';
import HelloWorld from '../containers/HelloWorld';
import TabBar from '../components/TabBar';

const DiscoverStack = createStackNavigator(
  {
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
    }
  },
  {
    initialRouteName: 'Discover'
  }
);

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
  }
});

const HelloWorldStack = createStackNavigator({
  HelloWorld: {
    screen: HelloWorld,
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
    Discover: DiscoverStack,
    MyList: MyListStack,
    Friends: FriendsStack
    // HelloWorld: HelloWorldStack
  },
  {
    initialRouteName: 'Discover',
    tabBarComponent: TabBar
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      App: TabStack,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Auth'
    }
  )
);
