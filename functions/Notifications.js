const config = require('./Config');
const utility = require('./Utility');
const deepLinking = require('../app/lib/DeepLinks');

const copyVariants = (type, name, post) => {
  const variants = {
    share: {
      title: `New shayr from ${name}`,
      body: `${name} wants you to check out "${post.title}"`
    },
    done: {
      title: `${name} marked your shayr as done`,
      body: `${name} finished checking out your shayr! Ask them how they liked it?`
    },
    like: {
      title: `${name} liked your shayr`,
      body: `${name} liked "${post.title}"`
    }
  };
  return variants[type];
};

const buildPostDetailNotification = (type, name, post) => {
  const copy = copyVariants(type, name, post);

  const message = {
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId: 'General',
      appLink: deepLinking.buildAppLink('shayr', 'shayr', 'PostDetail', { ...post })
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

exports.sendPostDetailNotificationToFriends = async (type, resources) => {
  // support type(s): [share, done, like]
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
          buildPostDetailNotification(
            type,
            resources.user.firstName,
            resources.post
          )
        );

        messages.push(
          config.msg.send({
            ...buildPostDetailNotification(
              type,
              resources.user.firstName,
              resources.post
            ),
            token: friend.pushToken
          })
        );
      }
    }
  }

  return Promise.all(messages);
};
