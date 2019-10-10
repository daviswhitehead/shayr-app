import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { StateKey } from '../FirebaseRedux';
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
  (state, stateKey, items, listKey, options) => options,
  (documents, options) => {
    if (!documents) {
      return;
    }
    const defaultOptions = {
      sortKeys: [],
      sortDirection: ['desc'],
      extraData: {},
      formatting: (o: any) => o,
      ...options
    };

    const _options = _.isEmpty(options)
      ? defaultOptions
      : { ...defaultOptions, options };

    return _.orderBy(
      _.reduce(
        documents,
        (result: { [key: string]: any }, value, key) => {
          const data = _options.formatting(value);
          const sortData = _.reduce(
            _options.sortKeys,
            (result: { [key: string]: any }, value: string) => {
              result[value] = _.get(data, value, 0);
              return result;
            },
            {}
          );

          result.push({
            ...data,
            ...sortData,
            ..._options.extraData
          });
          return result;
        },
        []
      ),
      _options.sortKeys,
      _options.sortDirection
    );
  }
)((state, stateKey, items, listKey, options) => {
  const sortKeys = _.get(options, 'sortKeys', '');
  const sortDirection = _.get(options, 'sortDirection', '');

  return `${stateKey}_${listKey}_${sortKeys}_${sortDirection}`;
});
