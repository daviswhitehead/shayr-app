import { StyleSheet } from "react-native";
import { fonts } from "../../styles/Fonts";
import { colors } from "../../styles/Colors";

export default StyleSheet.create({
  titleBox: {
    textAlign: "center"
  },
  titleText: {
    ...fonts.EXTRA_BOLD,
    fontSize: 24,
    color: colors.BLACK
  }
});
