import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  // createBottomTabNavigator,
} from 'react-navigation';
import ListenersLoaded from '../containers/ListenersLoaded';
import Feed from '../containers/Feed';
import Queue from '../containers/Queue';
import Login from '../containers/Login';
import PostDetail from '../containers/PostDetail';

// const TabStack = createBottomTabNavigator({
//   Feed,
//   Queue,
// });

const AppStack = createStackNavigator(
  {
    Feed: {
      screen: Feed,
    },
    Queue: {
      screen: Queue,
    },
    PostDetail: {
      screen: PostDetail,
      path: 'post/:users_posts',
    },
  },
  {
    initialRouteName: 'Feed',
  },
);

const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      ListenersLoaded,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'ListenersLoaded',
    },
  ),
);
