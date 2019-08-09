import { YellowBox } from 'react-native';
import React from 'react';

export const devSettings = () => {
  console.disableYellowBox = true;

  YellowBox.ignoreWarnings(['Warning: componentWillMount']);
  YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
  YellowBox.ignoreWarnings(['Warning: componentWillUpdate']);
  YellowBox.ignoreWarnings(['Warning: isMounted']);
  YellowBox.ignoreWarnings(['Remote debugger']);
  YellowBox.ignoreWarnings(['Module RCTImageLoader requires main queue setup']);
  YellowBox.ignoreWarnings([
    'Module ReactNativeShareExtension requires main queue setup'
  ]);
  YellowBox.ignoreWarnings(['source.uri should not be an empty string']);
  YellowBox.ignoreWarnings([
    'Cannot update during an existing state transition'
  ]);
  YellowBox.ignoreWarnings(['Require cycle']);
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
};
