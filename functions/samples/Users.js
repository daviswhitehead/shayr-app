const utility = require("../Utility");

// users
exports.users = () => {
  return [
    {
      id: 0,
      ref: "users/0",
      createdAt: utility.ts,
      email: "chillywilly.bootato@gmail.com",
      facebookProfilePhoto:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP",
      firstName: "Bob",
      lastName: "Sanders",
      updatedAt: utility.ts
    },
    {
      id: 1,
      ref: "users/1",
      createdAt: utility.ts,
      email: "blue@blue.com",
      facebookProfilePhoto:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP",
      firstName: "blue",
      lastName: "blue",
      updatedAt: utility.ts
    },
    {
      id: 2,
      ref: "users/2",
      createdAt: utility.ts,
      email: "yellow@yellow.com",
      facebookProfilePhoto:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP",
      firstName: "yellow",
      lastName: "yellow",
      updatedAt: utility.ts
    },
    {
      id: 3,
      ref: "users/3",
      createdAt: utility.ts,
      email: "red@red.com",
      facebookProfilePhoto:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP",
      firstName: "red",
      lastName: "red",
      updatedAt: utility.ts
    },
    {
      id: 4,
      ref: "users/4",
      createdAt: utility.ts,
      email: "green@green.com",
      facebookProfilePhoto:
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP",
      firstName: "green",
      lastName: "green",
      updatedAt: utility.ts
    }
  ];
};
