import { parseAppLink, protocols } from '@daviswhitehead/shayr-resources';
import { AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { navigate } from '../../lib/ReactNavigationHelpers';

// Types
export enum types {
  ROUTE_ADDED = 'ROUTE_ADDED',
  ROUTE_REMOVED = 'ROUTE_REMOVED'
}

// Actions
interface NavigateToRouteAction {
  type: types.ROUTE_REMOVED;
}

interface HandleURLRouteAction {
  type: types.ROUTE_ADDED;
  url: string;
  screen: string;
  params: any;
}

export type Actions = NavigateToRouteAction | HandleURLRouteAction;

// Action Creators
export const navigateToRoute = ({
  screen,
  params
}: {
  screen: string;
  params: any;
}): NavigateToRouteAction => {
  navigate(screen, params);
  return { type: types.ROUTE_REMOVED };
};

export const handleURLRoute = (payload: any) => {
  return (dispatch: Dispatch) => {
    let url;
    if (payload) {
      url = payload.url ? payload.url : payload;
    }

    const appLink = parseAppLink(url);

    if (protocols.includes(appLink.protocol)) {
      dispatch({
        type: types.ROUTE_ADDED,
        url: appLink.url,
        screen: appLink.screen,
        params: appLink.params
      });
    }
  };
};
