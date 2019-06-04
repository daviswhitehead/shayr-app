// write samples
export const writeSample = (db: any, obj: any) => obj.data.map((data: any, id: any) => db
  .doc(obj.path + id)
  .set(data)
  .then((value: any) => {
    console.log('sample write done');
    return value;
  })
  .catch((err: any) => {
    console.error(err);
    return err;
  }));

// users
export const users = (ts: any) => ({
  path: 'users/',
  data: [
    {
      createdAt: ts,
      email: 'chillywilly.bootato@gmail.com',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'Bob',
      lastName: 'Sanders',
      updatedAt: ts,
    },
    {
      createdAt: ts,
      email: 'test@test.com',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'test',
      lastName: 'test',
      updatedAt: ts,
    },
    {
      createdAt: ts,
      email: 'blue@blue.com',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'blue',
      lastName: 'blue',
      updatedAt: ts,
    },
    {
      createdAt: ts,
      email: 'yellow@yellow.com',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'yellow',
      lastName: 'yellow',
      updatedAt: ts,
    },
    {
      createdAt: ts,
      email: 'red@red.com',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'red',
      lastName: 'red',
      updatedAt: ts,
    },
    {
      createdAt: ts,
      email: 'green@green.com',
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'green',
      lastName: 'green',
      updatedAt: ts,
    },
  ],
});

// userShares
export const userZeroShares = (ts: any) => ({
  path: 'users/0/shares/',
  data: [
    {
      createdAt: ts,
      post: 'posts/FLbuXOvQBIgrAr2597YX',
      updatedAt: ts,
      url:
        'https://www.nytimes.com/2018/04/03/business/media/spotifys-wall-street-debut-is-a-success.html',
    },
  ],
});
export const userOneShares = (ts: any) => ({
  path: 'users/1/shares/',
  data: [
    {
      createdAt: ts,
      post: 'posts/BHgq1O0s0VsjidGcRO95',
      updatedAt: ts,
      url: 'https://futurism.com/virtual-real-estate/amp/',
    },
  ],
});

// userFriends
export const userZeroFriends = (ts: any) => ({
  path: 'users/0/friends/',
  data: [
    {
      createdAt: ts,
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'Bob',
      lastName: 'Sanders',
      status: 'accepted',
      updatedAt: ts,
      user: 'users/1',
    },
  ],
});
export const userOneFriends = (ts: any) => ({
  path: 'users/1/shares/',
  data: [
    {
      createdAt: ts,
      facebookProfilePhoto:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
      firstName: 'test',
      lastName: 'test',
      status: 'accepted',
      updatedAt: ts,
      user: 'users/0',
    },
  ],
});

export const potentialShares = (ts: any) => [
  {
    path: 'users/0/shares/10',
    payload: {
      createdAt: null,
      updatedAt: null,
      url:
        'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb',
    },
  },
  {
    path: 'users/0/shares/11',
    payload: {
      createdAt: null,
      updatedAt: null,
      url:
        'https://newyorker.com/humor/daily-shouts/a-deep-dive-to-remember-a-love-story-between-business-managers-written-by-a-business-manager',
    },
  },
  // {
  //   path: 'users/0/shares/12',
  //   payload: {
  //     createdAt: null,
  //     updatedAt: null,
  //     url: 'https://bostonglobe.com/metro/2018/05/16/bike-share-border-war-has-started-boston/Hdb22XyWEnQAuh4r8zUdSI/story.html',
  //   }
  // },
  // {
  //   path: 'users/0/shares/13',
  //   payload: {
  //     createdAt: null,
  //     updatedAt: null,
  //     url: 'https://medium.com/@ow/apple-has-no-idea-whats-next-so-it-s-just-banging-on-the-same-old-drum-dcfd0179cf80',
  //   }
  // },
  // {
  //   path: 'users/0/shares/14',
  //   payload: {
  //     createdAt: null,
  //     updatedAt: null,
  //     url: 'https://hodinkee.com/magazine/jony-ive-apple',
  //   }
  // },
  // {
  //   path: 'users/0/shares/15',
  //   payload: {
  //     createdAt: null,
  //     updatedAt: null,
  //     url: 'https://stratechery.com/2016/cars-and-the-future/',
  //   }
  // },
];

// posts
export const posts = (ts: any) => ({
  path: 'posts/',
  data: [
    {
      createdAt: ts,
      description:
        'The question at the heart of this gamble is: are people really going to hang out in virtual reality?',
      image: 'https://wp-assets.futurism.com/2018/06/realestate-600x315.png',
      medium: 'article',
      publisher: {
        logo: '',
        name: 'Futurism',
      },
      title: 'People are paying insane amounts of real money for "virtual real estate"',
      updatedAt: ts,
      url: 'https://futurism.com/virtual-real-estate/amp/',
    },
    {
      createdAt: ts,
      description:
        'After its first day on the New York Stock Exchange, the music streaming service was valued at $26.5 billion, putting it in the company of firms like General Mills.',
      image:
        'https://static01.nyt.com/images/2018/04/04/business/04SPOTIFY1/04SPOTIFY1-facebookJumbo.jpg',
      medium: 'article',
      publisher: {
        logo: '',
        name: '@nytimes',
      },
      title: 'Spotify’s Wall Street Debut Is a Success',
      updatedAt: ts,
      url:
        'https://nytimes.com/2018/04/03/business/media/spotifys-wall-street-debut-is-a-success.html',
    },
  ],
});
