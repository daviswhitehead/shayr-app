exports.getCount = (postRef, data, counterType) => {
  // active false means the user removed their action
  var activeToggle = data.active;

  // get post data
  return postRef.get().then(doc => {
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
