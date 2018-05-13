import { AppRegistry } from 'react-native';
import { devSettings } from './dev';

devSettings();

AppRegistry.registerComponent('shayr', () => require('./app/App').default);
AppRegistry.registerComponent('ShareExtension', () => require('./app/containers/Share').default);
// AppRegistry.registerComponent('ShareExtension', () => require('./app/containers/SharePurple').default);
