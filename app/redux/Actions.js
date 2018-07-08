// Authentication
export const authenticationActionTypes = {
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SIGN_UP: 'SIGN_UP',
}

export const authenticationActions = {
  SIGN_IN: () => {
    return { type: SIGN_IN }
  },
  SIGN_OUT: () => {
    return { type: SIGN_OUT }
  },
  SIGN_UP: () => {
    return { type: SIGN_UP }
  },
}
