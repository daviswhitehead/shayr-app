import { StyleSheet } from "react-native";

import { layout } from "../../styles/Layout";

export default StyleSheet.create({
  container: {
    padding: layout.PADDING_MEDIUM
  },
  imageList: {
    width: 104,
    height: 104,
    borderRadius: 10
  },
  imageDetail: {
    width: 120,
    height: 120,
    borderRadius: 10
  }
});
