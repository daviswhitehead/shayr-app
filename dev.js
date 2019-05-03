import { YellowBox } from 'react-native';

console.disableYellowBox = true;

export const devSettings = () => {
  YellowBox.ignoreWarnings(['Warning: componentWillMount']);
  YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
  YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
  YellowBox.ignoreWarnings(['Warning: isMounted']);
  YellowBox.ignoreWarnings(['Remote debugger']);
  YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue setup']);
  YellowBox.ignoreWarnings(['Module ReactNativeShareExtension requires main queue setup']);
  YellowBox.ignoreWarnings(['source.uri should not be an empty string']);
  YellowBox.ignoreWarnings(['Cannot update during an existing state transition']);
  YellowBox.ignoreWarnings(['Require cycle']);
};
