import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import AuthLoading from '../containers/AuthLoading';
import LoginListeners from '../containers/LoginListeners';
import Feed from '../containers/Feed';
import Queue from '../containers/Queue';
import Login from '../containers/Login';
import PostDetail from '../containers/PostDetail';

const AppStack = createStackNavigator({
  LoginListeners: {
    screen: LoginListeners,
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
});

const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    // navigationOptions: ({ navigation }) => ({
    //   header: null,
    // }),
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
