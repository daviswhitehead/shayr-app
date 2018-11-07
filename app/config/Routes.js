import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import LoginListeners from "../containers/LoginListeners";
import Feed from "../containers/Feed";
import Queue from "../containers/Queue";
import Login from "../containers/Login";

export const RootNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    LoginListeners: {
      screen: LoginListeners
    },
    Feed: { screen: Feed },
    Queue: { screen: Queue }
  },
  {
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.routeName}`.toLowerCase(),
      headerStyle: {
        backgroundColor: "#F2C94C",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 3
      },
      headerTitleStyle: {
        fontWeight: "800"
      },
      headerTintColor: "black",
      headerBackTitle: null,
      headerLeft: null
    })
  }
);
