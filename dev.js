import { YellowBox } from 'react-native';

export const devSettings = () => {
  YellowBox.ignoreWarnings(['Warning: componentWillMount']);
  YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
  YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
  YellowBox.ignoreWarnings(['Warning: isMounted']);
  YellowBox.ignoreWarnings(['Remote debugger']);
  YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue setup']);
  YellowBox.ignoreWarnings(['Module ReactNativeShareExtension requires main queue setup']);
  YellowBox.ignoreWarnings(['source.uri should not be an empty string']);
}
