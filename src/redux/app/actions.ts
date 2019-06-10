export const types = {
  // APP_READY
  IS_APP_READY: 'IS_APP_READY'
};

// APP_READY
export const isAppReady = (isReady: boolean) => ({
  type: types.IS_APP_READY,
  isAppReady: isReady
});
