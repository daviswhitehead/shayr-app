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
import AuthWithListeners from '../containers/AuthWithListeners';

// const TabStack = createBottomTabNavigator({
//   Feed,
//   Queue,
// });

const AppStack = createStackNavigator(
  {
    AuthWithListeners: {
      screen: AuthWithListeners,
    },
    Feed: {
      screen: Feed,
    },
    Queue: {
      screen: Queue,
    },
    PostDetail: {
      screen: PostDetail,
    },
  },
  {
    initialRouteName: 'AuthWithListeners',
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
