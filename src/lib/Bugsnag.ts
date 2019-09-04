import { Client } from 'bugsnag-react-native';
import Config from 'react-native-config';

export const bugsnag: Client = new Client(Config.BUGSNAG_KEY);
export const setUser = bugsnag.setUser;
export const notify = bugsnag.notify;
