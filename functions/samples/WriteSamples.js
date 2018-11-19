const config = require("../Config");
const utility = require("../Utility");
const users = require("./Users");
const shares = require("./Shares");
const _ = require("lodash");

const write = (db, samples) => {
  var batch = db.batch();
  for (var s in samples) {
    if (samples.hasOwnProperty(s)) {
      batch.set(db.doc(samples[s].ref), _.omit(samples[s], "id", "ref"));
    }
  }
  return utility.returnBatch(batch);
};

// write(config.db, users.users());
// write(config.db, shares.inboundShares());
write(config.db, shares.inboundSharesRound2());
