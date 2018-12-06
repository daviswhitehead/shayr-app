import { StyleSheet } from "react-native";

import { colors } from "../../styles/Colors";
import { fonts } from "../../styles/Fonts";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  modal: {
    backgroundColor: colors.YELLOW,
    height: 60,
    width: 60 * 4,
    marginBottom: 100,
    borderRadius: 60,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: colors.SHADOW,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5
  },
  logo: {
    height: 60,
    width: 60
  },
  text: {
    textAlign: "center",
    ...fonts.BOLD,
    fontSize: 30,
    color: colors.BLACK
  }
});
