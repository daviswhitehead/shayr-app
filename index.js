import { AppRegistry } from 'react-native';
import Promise from 'bluebird';
import { devSettings } from './dev';

// https://stackoverflow.com/questions/48487089/global-unhandledrejection-listener-in-react-native/49129335#49129335
// We use the "Bluebird" lib for Promises, because it shows good perf
// and it implements the "unhandledrejection" event:
global.Promise = Promise;

// Global catch of unhandled Promise rejections:
global.onunhandledrejection = function onunhandledrejection(error) {
  // Warning: when running in "remote debug" mode (JS environment is Chrome browser),
  // this handler is called a second time by Bluebird with a custom "dom-event".
  // We need to filter this case out:
  if (error instanceof Error) {
    console.error(error); // Your custom error logging/reporting code
  }
};

devSettings();

AppRegistry.registerComponent(
  'shayr',
  () => require('./src/containers/App').default
);
AppRegistry.registerComponent(
  'ShareExtension',
  () => require('./src/containers/Share').default
);
