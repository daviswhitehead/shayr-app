import { State } from '../Reducers';

export const selectAuthUserId = (state: State) => state.auth.user.uid;
