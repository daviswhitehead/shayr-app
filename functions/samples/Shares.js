const utility = require("../Utility");

// {
//   createdAt (timestamp),
//   post (reference),
//   updatedAt (timestamp),
//   url (string),
//   user (reference),
// }

exports.inboundShares = () => {
  return [
    {
      id: 0,
      ref: "users/0/inboundShares/0",
      createdAt: utility.ts,
      updatedAt: utility.ts,
      url:
        "https://nytimes.com/2018/04/03/business/media/spotifys-wall-street-debut-is-a-success.html"
    },
    {
      id: 1,
      ref: "users/0/inboundShares/1",
      createdAt: utility.ts,
      updatedAt: utility.ts,
      url: "https://futurism.com/virtual-real-estate/amp/"
    },
    {
      id: 2,
      ref: "users/0/inboundShares/2",
      createdAt: utility.ts,
      updatedAt: utility.ts,
      url:
        "https://mrmoneymustache.com/2015/04/15/great-news-early-retirement-doesnt-mean-youll-stop-working/"
    }
  ];
};
