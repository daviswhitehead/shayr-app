import _ from 'lodash';
import createCachedSelector from 're-reselect';
// https://github.com/toomuchdesign/re-reselect
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

export const selectAuthUserId = state => state.auth.user.uid;
