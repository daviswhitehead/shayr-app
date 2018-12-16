import { createStackNavigator } from "react-navigation";
import LoginListeners from "../containers/LoginListeners";
import Feed from "../containers/Feed";
import Queue from "../containers/Queue";
import Login from "../containers/Login";
import PostDetail from "../containers/PostDetail";

export const RootNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  LoginListeners: {
    screen: LoginListeners
  },
  Feed: {
    screen: Feed
  },
  Queue: {
    screen: Queue
  },
  PostDetail: {
    screen: PostDetail
  }
});
