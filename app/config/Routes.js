import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import ListenersLoaded from '../containers/ListenersLoaded';
import Feed from '../containers/Feed';
import Queue from '../containers/Queue';
import Login from '../containers/Login';
import PostDetail from '../containers/PostDetail';

const AppStack = createStackNavigator({
  Feed: {
    screen: Feed,
  },
  Queue: {
    screen: Queue,
  },
  PostDetail: {
    screen: PostDetail,
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
