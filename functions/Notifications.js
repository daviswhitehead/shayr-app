const config = require("./Config");
const utility = require("./Utility");

exports.sendNewSharePushNotificationToFriends = async resources => {
  let messageBase = {
    title: "New Shayr",
    body: `${resources.user.firstName} shayred something new!`
  };

  let message = {
    notification: {
      ...messageBase
    },
    data: {
      ...messageBase,
      channelId: "General"
    },
    android: {
      priority: "high"
    },
    apns: {
      payload: {
        aps: {
          alert: {
            ...messageBase
          },
          badge: 1
        }
      }
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
        console.log(friend);
        messages.push(
          config.msg.send({
            ...message,
            token: friend.pushToken
          })
        );
      }
    }
  }
  console.log(messages);

  return Promise.all(messages);
};

exports.sendNewDonePushNotificationToSharer = async resources => {
  let messageBase = {
    title: "New Shayr",
    body: `${resources.user.firstName} shayred something new!`
  };

  let message = {
    notification: {
      ...messageBase
    },
    data: {
      ...messageBase,
      channelId: "General"
    },
    android: {
      priority: "high"
    },
    apns: {
      payload: {
        aps: {
          alert: {
            ...messageBase
          },
          badge: 1
        }
      }
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
        console.log(friend);
        messages.push(
          config.msg.send({
            ...message,
            token: friend.pushToken
          })
        );
      }
    }
  }
  console.log(messages);

  return Promise.all(messages);
};
