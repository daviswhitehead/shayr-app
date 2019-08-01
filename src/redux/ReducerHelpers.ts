import { StateKey } from './lists/actions';

export const createNamedWrapperReducer = (
  reducerFunction: (state: any, action: any) => void,
  reducerName: StateKey
) => {
  return (state: any, action: any) => {
    const { stateKey } = action;
    const isInitializationCall = state === undefined;
    if (stateKey !== reducerName && !isInitializationCall) return state;

    return reducerFunction(state, action);
  };
};
