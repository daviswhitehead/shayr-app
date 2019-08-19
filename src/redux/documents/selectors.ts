import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { StateKey } from '../FirebaseRedux';
import { selectListItems } from '../lists/selectors';
import { State } from '../Reducers';

const selectDocumentsState = (state: State, stateKey: StateKey) =>
  state[stateKey];
const selectDocument = (state: State, stateKey: StateKey, documentId: string) =>
  state[stateKey][documentId];

export const selectDocumentFromId = createCachedSelector(
  selectDocument,
  (document) => document
)((state, stateKey, documentId) => `${stateKey}_${documentId}`);

export const selectDocumentsFromItems = createCachedSelector(
  selectDocumentsState,
  (state, stateKey, items) => items,
  (documents, items) => {
    if (!documents || !items) {
      return;
    }
    return _.pick(documents, items);
  }
)((state, listState, listKey) => `${listState}_${listKey}`);

export const selectFlatListReadyDocuments = createCachedSelector(
  selectDocumentsFromItems,
  (state, stateKey, items, listKey, sortKey) => sortKey,
  (documents, sortKey) => {
    if (!documents || !sortKey) {
      return;
    }
    return _.reverse(_.sortBy(documents, (value) => value[sortKey]));
  }
)(
  (state, stateKey, items, listKey, sortKey) =>
    `${stateKey}_${listKey}_${sortKey}`
);
