import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import TabBar from '../components/TabBar';
import Discover from '../containers/Discover';
import Friends from '../containers/Friends';
import Login from '../containers/Login';
import MyList from '../containers/MyList';
import PostDetail from '../containers/PostDetail';

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
    },
    MyList: {
      screen: MyList,
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
    }
    // Settings: {
    //   screen: Settings,
    //   navigationOptions: () => ({
    //     header: null
    //   })
    // }
  },
  {
    initialRouteName: 'MyList'
  }
);

const FriendsStack = createStackNavigator(
  {
    Friends: {
      screen: Friends,
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
