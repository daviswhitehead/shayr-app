import { NavigationActions } from 'react-navigation';

export const types = {
  POST_DETAIL_VIEW: 'POST_DETAIL_VIEW',
  POST_DETAIL_BACK: 'POST_DETAIL_BACK',
};

export const postDetailView = post => function (dispatch) {
  dispatch(NavigationActions.navigate({ routeName: 'PostDetail' }));
  dispatch({
    type: types.POST_DETAIL_VIEW,
    payload: post,
  });
};

export const postDetailBack = () => function (dispatch) {
  dispatch(NavigationActions.back());
  dispatch({
    type: types.POST_DETAIL_BACK,
  });
};
