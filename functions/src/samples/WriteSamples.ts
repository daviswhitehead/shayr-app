import * as _ from 'lodash';
import { returnBatch } from '../Utility';
import { db } from '../Config';
import { inboundSharesRound2 } from './Shares';
// import { inboundShares, inboundSharesRound2 } from './Shares';
// import { users } from './Users';

const write = (database: any, samples: any) => {
  const batch = database.batch();
  for (const s in samples) {
    if (samples.hasOwnProperty(s)) {
      batch.set(database.doc(samples[s].ref), _.omit(samples[s], 'id', 'ref'));
    }
  }
  return returnBatch(batch);
};

// write(db, users());
// write(db, inboundShares());
write(db, inboundSharesRound2());
