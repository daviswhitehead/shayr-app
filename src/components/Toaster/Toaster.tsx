import Toast from 'react-native-root-toast';

import colors from '../../styles/Colors';

export const Toaster = message =>
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: -120,
    shadow: true,
    textColor: colors.BLACK,
    backgroundColor: colors.YELLOW,
    opacity: 1,
    animation: true,
    hideOnPress: true,
    delay: 0,
    shadowColor: colors.SHADOW,
    shadowOpacity: 0.75
  });

// export const hideToast = () => Toast.hide();
