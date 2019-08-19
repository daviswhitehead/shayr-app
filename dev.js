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

// componentDidUpdate(prevProps) {
//   // console.log('NEW COMPONENT_DID_UPDATE:');

//   // console.log(
//   //   `DIFF ${JSON.stringify(
//   //     getObjectDiff(
//   //       _.get(this.props, 'authUser', {}),
//   //       _.get(prevProps, 'authUser', {})
//   //     ),
//   //     undefined,
//   //     2
//   //   )}`
//   // );

//   // const now = Object.entries(this.props);
//   // const added = now.filter(([key, val]) => {
//   //   if (prevProps[key] === undefined) return true;
//   //   if (prevProps[key] !== val) {
//   //     console.log(`
//   //     CHANGED
//   //     ${key}
//   //       DIFF ${JSON.stringify(
//   //         getObjectDiff(val, prevProps[key]),
//   //         undefined,
//   //         2
//   //       )}
//   //       NEW ${JSON.stringify(val, undefined, 2)}
//   //       OLD ${JSON.stringify(prevProps[key], undefined, 2)}`);
//   //   }
//   //   return false;
//   // });
//   // added.forEach(([key, val]) =>
//   //   console.log(`
//   //   ADDED
//   //   ${key}
//   //       ${JSON.stringify(val, undefined, 2)}`)
//   // );
//   console.log();
// }

// console.log(`PostDetail - Render Count: ${RENDER_COUNT}`);
// console.log('this.props');
// console.log(this.props);
// console.log('this.state');
// console.log(this.state);
