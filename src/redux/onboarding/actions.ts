import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { Dispatch } from 'redux';

export enum types {
  GET_ONBOARDING_STATUS = 'GET_ONBOARDING_STATUS',
  SET_ONBOARDING_STATUS = 'SET_ONBOARDING_STATUS'
}

export enum items {
  DID_VIEW_INTRO = 'didViewIntro',
  DID_VIEW_HOW_TO = 'didViewHowTo'
}

const PREFIX = 'Shayr:';

interface GetOnboardingStatus {
  type: types.GET_ONBOARDING_STATUS;
  [items.DID_VIEW_INTRO]: boolean;
  [items.DID_VIEW_HOW_TO]: boolean;
}

export type Actions = GetOnboardingStatus;

const generateAsyncPaths = (items: string[], options = { PREFIX }) => {
  return _.map(items, (item: string) => `${options.PREFIX}${item}`);
};

export const getOnboardingStatus = () => {
  return async (dispatch: Dispatch) => {
    let values;
    const paths = generateAsyncPaths(_.values(items));

    try {
      values = await AsyncStorage.multiGet(paths);
      dispatch({
        type: types.GET_ONBOARDING_STATUS,
        ..._.reduce(
          values,
          (result: { [key: string]: string | boolean }, item: Array<any>) => {
            result[_.replace(item[0], PREFIX, '')] = !!JSON.parse(item[1]);
            return result;
          },
          {}
        )
      });
    } catch (e) {
      console.error(e);
    }
  };
};

export const setOnboardingStatus = (item: items, status: boolean = true) => {
  return async (dispatch: Dispatch) => {
    const paths = generateAsyncPaths([item]);

    try {
      await AsyncStorage.setItem(paths[0], JSON.stringify(status));
      dispatch({
        type: types.SET_ONBOARDING_STATUS
      });
    } catch (e) {
      console.error(e);
    }
  };
};
