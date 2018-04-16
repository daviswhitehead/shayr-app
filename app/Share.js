import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import ShareModal from './containers/ShareModal';

export default class App extends Component {
  render() {
    return (
      <ShareModal/>
    );
  }
}
// import ShareModal from './containers/ShareModal';
// import DevMenu from './lib/DevMenu';
//
// export default class App extends Component {
//   render() {
//     return (
//       <View>
//         <ShareModal/>
//         <DevMenu/>
//       </View>
//     );
//   }
// }

//
// export default class App extends Component {
//   render() {
//     return (
//       <DevMenu/>
//     );
//   }
// }
