import { StyleSheet } from "react-native";

import { layout } from "../../styles/Layout";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: layout.MARGIN_SHORT
  },
  iconBox: {
    padding: layout.PADDING_MEDIUM
  },
  countBox: {
    height: 20,
    width: 16
  },
  count: {
    fontSize: 16,
    // textAlignVertical: 'center',
    textAlign: "center"
  }
});
