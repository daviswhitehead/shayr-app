import { StyleSheet } from "react-native";

import { colors } from "../../styles/Colors";
import { layout } from "../../styles/Layout";
import { fontSystem } from "../../styles/Fonts";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    backgroundColor: colors.WHITE
  },
  contentBox: {
    flexDirection: "row",
    justifyContent: "space-between"
    // borderColor: 'blue',
    // borderWidth: 5,
  },
  dividerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: layout.PADDING_MEDIUM
    // borderColor: 'red',
    // borderWidth: 5,
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "space-between"
    // borderColor: 'pink',
    // borderWidth: 5,
  },
  divider: {
    backgroundColor: colors.LIGHT_GRAY,
    height: 1,
    width: 48
  },
  summaryBox: {
    padding: layout.PADDING_MEDIUM
    // borderColor: 'green',
    // borderWidth: 5,
  },
  header: {
    ...fontSystem.H2
  },
  body: {
    ...fontSystem.BODY
  },
  actionByBox: {
    borderColor: "yellow",
    borderWidth: 5
  }
});
