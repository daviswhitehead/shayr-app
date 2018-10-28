exports.getUpdatedCount = (db, ref, activeToggle, counterType) => {
  // activeToggle false means the user removed their action

  // get document data
  return db
    .doc(ref)
    .get()
    .then(doc => {
      var data = doc.data();

      // get counter value or initialize
      var count = data[counterType] ? data[counterType] : 0;

      // increment counter
      if (activeToggle) {
        count = count + 1;
      } else {
        count = count - 1;
      }

      // updated counter payload
      var payload = {};
      payload[counterType] = count;
      return payload;
    });
};
