import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { selectListItems } from '../lists/selectors';

export const selectListNeedsOnboarding = createCachedSelector(
  selectListItems,
  (state, stateKey, listKey, onboardingKey) => onboardingKey,
  (items, onboardingKey) => {
    if (!items) {
      return;
    }
    if (
      _.isEmpty(items) ||
      (items.length === 1 && _.includes(items[0], onboardingKey))
    ) {
      return true;
    }

    return false;
  }
)(
  (state, stateKey, listKey, onboardingKey) =>
    `${stateKey}_${listKey}_${onboardingKey}`
);
