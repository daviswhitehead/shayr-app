import { StyleSheet } from "react-native";

import { layout } from "../../styles/Layout";

export default class StyleSheetFactory {
  static getSheet(view) {
    let imageSize = 104;
    if (view === "detail") {
      imageSize = 120;
    }
    return StyleSheet.create({
      container: {
        padding: layout.PADDING_MEDIUM
      },
      image: {
        width: imageSize,
        height: imageSize,
        borderRadius: 10
      }
    });
  }
}
