const config = require('./Config');
const utility = require('./Utility');
const deepLinking = require('../app/lib/DeepLinks');

const newShareNotification = (name, post) => {
  const copy = {
    title: 'New Shayr!',
    body: `${name} wants you to check out "${post.title}"`
  };

  const message = {
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId: 'General',
      appLink: deepLinking.buildAppLink(
        (protocol = 'shayr'),
        (hostname = 'shayr'),
        (screen = 'PostDetail'),
        (params = { ...post })
      )
    },
    android: {
      priority: 'high'
    },
    apns: {
      payload: {
        aps: {
          alert: {
            ...copy
          },
          badge: 1
        }
      }
    }
  };
  return message;
};

const newDoneNotification = (name, postTitle, postId) => {
  const copy = {
    title: 'New Done!',
    body: `${name} finished checking out your shayr. Ask them what they think!`
  };

  const message = {
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId: 'General'
    },
    android: {
      priority: 'high'
    },
    apns: {
      payload: {
        aps: {
          alert: {
            ...copy
          },
          badge: 1
        }
      }
    }
  };
  return message;
};

const newLikeNotification = (name, postTitle, postId) => {
  const copy = {
    title: 'New Like!',
    body: `${name} liked your shayr`
  };

  const message = {
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId: 'General'
    },
    android: {
      priority: 'high'
    },
    apns: {
      payload: {
        aps: {
          alert: {
            ...copy
          },
          badge: 1
        }
      }
    }
  };
  return message;
};

exports.sendNewSharePushNotificationToFriends = async resources => {
  var messages = [];

  for (var friendId in resources.friends) {
    if (resources.friends.hasOwnProperty(friendId)) {
      // eslint-disable-next-line no-await-in-loop
      var friend = await utility.getDocument(
        config.db.doc(`users/${resources.friends[friendId].friendUserId}`),
        `users/${resources.friends[friendId].friendUserId}`
      );

      if (friend && friend.pushToken) {
        console.log(
          newShareNotification(resources.user.firstName, resources.post)
        );

        messages.push(
          config.msg.send({
            ...newShareNotification(resources.user.firstName, resources.post),
            token: friend.pushToken
          })
        );
      }
    }
  }
  console.log(messages);

  return Promise.all(messages);
};

exports.sendNewDonePushNotificationToFriends = async resources => {
  var messages = [];

  for (var friendId in resources.friends) {
    if (resources.friends.hasOwnProperty(friendId)) {
      // eslint-disable-next-line no-await-in-loop
      var friend = await utility.getDocument(
        config.db.doc(`users/${resources.friends[friendId].friendUserId}`),
        `users/${resources.friends[friendId].friendUserId}`
      );

      if (friend && friend.pushToken) {
        messages.push(
          config.msg.send({
            ...newDoneNotification(
              resources.user.firstName,
              resources.post.title,
              resources.post.id
            ),
            token: friend.pushToken
          })
        );
      }
    }
  }

  return Promise.all(messages);
};

exports.sendNewLikePushNotificationToFriends = async resources => {
  var messages = [];

  for (var friendId in resources.friends) {
    if (resources.friends.hasOwnProperty(friendId)) {
      // eslint-disable-next-line no-await-in-loop
      var friend = await utility.getDocument(
        config.db.doc(`users/${resources.friends[friendId].friendUserId}`),
        `users/${resources.friends[friendId].friendUserId}`
      );

      if (friend && friend.pushToken) {
        messages.push(
          config.msg.send({
            ...newLikeNotification(
              resources.user.firstName,
              resources.post.title,
              resources.post.id
            ),
            token: friend.pushToken
          })
        );
      }
    }
  }

  return Promise.all(messages);
};
