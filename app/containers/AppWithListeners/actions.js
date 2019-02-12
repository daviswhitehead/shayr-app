export const types = {
  NOTIFICATION_TAPPED: "NOTIFICATION_TAPPED",
  NOTIFICATION_NAVIGATION_PROCESSED: "NOTIFICATION_NAVIGATION_PROCESSED",
  NOTIFICATION_SUCCESS: "NOTIFICATION_SUCCESS",
  NOTIFICATION_FAIL: "NOTIFICATION_FAIL"
};

export const saveNotificationNavigation = async (dispatch, notification) => {
  dispatch({ type: types.NOTIFICATION_TAPPED });

  try {
    if (notification.data.navigation === "TRUE") {
      dispatch({
        type: types.NOTIFICATION_NAVIGATION_PROCESSED,
        payload: notification.data.postId
      });
    }

    dispatch({ type: types.NOTIFICATION_SUCCESS });
  } catch (error) {
    dispatch({
      type: types.NOTIFICATION_FAIL,
      error
    });
  }
};
