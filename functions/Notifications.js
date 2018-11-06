const config = require("./Config");
const utility = require("./Utility");

exports.sendNewSharePushNotificationToFriends = async resources => {
  let payload = {
    notification: {
      title: "New Shayr",
      body: `${resources.user.firstName} shayred something new!`,
      badge: "1",
      channelId: "new-shayr-channel"
    }
  };
  var messages = [];

  for (var friendId in resources.friends) {
    if (resources.friends.hasOwnProperty(friendId)) {
      // eslint-disable-next-line no-await-in-loop
      var friend = await utility.getDocument(
        config.db.doc(`users/${resources.friends[friendId].friendUserId}`),
        `users/${resources.friends[friendId].friendUserId}`
      );
      if (friend && friend.pushToken) {
        messages.push(config.msg.sendToDevice(friend.pushToken, payload));
      }
    }
  }
  return Promise.all(messages);
};
