import { StyleSheet, StatusBar, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  }
});
