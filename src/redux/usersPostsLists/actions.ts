import _ from 'lodash';
import { generateActionTypes, listActionTypes } from '../../lib/FirebaseRedux';

export const STATE_KEY = 'usersPostsLists';

export const types = generateActionTypes(STATE_KEY, listActionTypes);
