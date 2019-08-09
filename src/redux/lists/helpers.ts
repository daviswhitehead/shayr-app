import { queryTypes } from '../../lib/FirebaseQueries';

export const generateListKey = (id: string, queryType: queryTypes) => {
  return `${id}_${queryType}`;
};
