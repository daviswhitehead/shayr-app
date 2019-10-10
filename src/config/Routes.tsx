import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon, { names } from '../components/Icon';
import Discover from '../containers/Discover';
import FindFriends from '../containers/FindFriends';
import Friends from '../containers/Friends';
import Intro from '../containers/Intro';
import Login from '../containers/Login';
import MyList from '../containers/MyList';
import Notifications from '../containers/Notifications';
import PostDetail from '../containers/PostDetail';
import { IconWithFriendCount } from '../higherOrderComponents/withFriendCount';
import { getActiveRouteName } from '../lib/ReactNavigationHelpers';
import Colors from '../styles/Colors';
import Layout from '../styles/Layout';

const sharedRoutes = {
  MyList: {
    screen: MyList
  },
  Friends: {
    screen: Friends
  },
  PostDetail: {
    screen: PostDetail
  }
};

const DiscoverStack = createStackNavigator(
  {
    ...sharedRoutes,
    Discover: {
      screen: Discover
    },
    Notifications: {
      screen: Notifications
    }
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      const activeRoute = getActiveRouteName(navigation.state);

      let tabBarVisible = true;

      if (activeRoute === 'PostDetail') {
        tabBarVisible = false;
      }

      return { tabBarVisible };
    }
  }
);

const MyListStack = createStackNavigator(
  {
    ...sharedRoutes
  },
  {
    initialRouteName: 'MyList',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      const activeRoute = getActiveRouteName(navigation.state);

      let tabBarVisible = true;

      if (activeRoute === 'PostDetail') {
        tabBarVisible = false;
      }

      return { tabBarVisible };
    }
  }
);

const FriendsStack = createStackNavigator(
  {
    ...sharedRoutes,
    FindFriends: {
      screen: FindFriends
    }
  },
  {
    initialRouteName: 'Friends',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      const activeRoute = getActiveRouteName(navigation.state);

      let tabBarVisible = true;

      if (activeRoute === 'PostDetail' || activeRoute === 'FindFriends') {
        tabBarVisible = false;
      }

      return { tabBarVisible };
    }
  }
);

const AuthStack = createSwitchNavigator(
  {
    Intro: {
      screen: Intro
    },
    Login: {
      screen: Login
    }
  },
  {
    initialRouteName: 'Intro'
  }
);

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
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'DiscoverTab') {
          iconName = focused ? names.DISCOVER_ACTIVE : names.DISCOVER;
        }
        if (routeName === 'MyListTab') {
          iconName = focused ? names.LIST_ACTIVE : names.LIST;
        }
        if (routeName === 'FriendsTab') {
          iconName = focused ? names.FRIENDS_ACTIVE : names.FRIENDS;
        }

        if (!iconName) {
          return;
        }
        return routeName === 'FriendsTab' ? (
          <IconWithFriendCount name={iconName} />
        ) : (
          <Icon name={iconName} />
        );
      }
    }),
    tabBarOptions: {
      showLabel: false,
      style: {
        height: Math.max(
          Layout.WINDOW_BOTTOM_SAFE_AREA + Layout.SPACING_EXTRA_LONG,
          Layout.SPACING_EXTRA_LONG * 2
        ),
        backgroundColor: Colors.YELLOW,
        paddingHorizontal: Layout.SPACING_EXTRA_LONG
      },
      labelStyle: { margin: 0, padding: 0 },
      iconStyle: { margin: 0, padding: 0 }
    },

    initialRouteName: 'DiscoverTab'
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
