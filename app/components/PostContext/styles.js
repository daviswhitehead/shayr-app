import { StyleSheet } from "react-native";

import { layout } from "../../styles/Layout";
import { fontSystem } from "../../styles/Fonts";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: layout.PADDING_MEDIUM
  },
  textBox: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  title: {
    ...fontSystem.POST_TITLE
  },
  publisher: {
    ...fontSystem.POST_PUBLISHER
  },
  actionsBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center"
  }
});
