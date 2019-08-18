import _ from 'lodash';

export const generateListKey = (...ids: string[]) => {
  return _.join(ids, '_');
};
