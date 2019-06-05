import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center"
  },
  iconBox: {
    height: 24,
    width: 24,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  countBox: {
    height: 24,
    width: 24,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  count: {
    fontSize: 16,
    textAlignVertical: "center",
    textAlign: "center"
  }
});
