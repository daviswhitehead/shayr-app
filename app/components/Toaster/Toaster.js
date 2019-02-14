import Toast from "react-native-root-toast";

import colors from "../../styles/Colors";

export const Toaster = message => {
  return Toast.show(message, {
    duration: Toast.durations.LONG,
    position: -40,
    shadow: true,
    textColor: colors.BLACK,
    backgroundColor: colors.YELLOW,
    opacity: 1,
    animation: true,
    hideOnPress: true,
    delay: 500,
    shadowColor: colors.SHADOW,
    shadowOpacity: 0.75
  });
};
