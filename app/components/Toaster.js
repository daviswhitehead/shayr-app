import Toast from 'react-native-root-toast';

export const createToast = (message) => {
  return Toast.show(message, {
      duration: Toast.durations.LONG,
      position: -40,
      shadow: true,
      textColor: 'black',
      backgroundColor: '#F2C94C',
      opacity: 1,
      animation: true,
      hideOnPress: true,
      delay: 500,
      shadowColor: '#000',
      shadowOpacity: 0.75,
  });
}
