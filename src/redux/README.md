# Application State

## root

### description

### initialState

```javascript
{
  app: {},
  auth: {},
  friendships: {},
  routing: {},
  usersLists: {},
  usersPosts: {},
  usersPostsLists: {},
  users: {},
}
```

## app

### description

The app state contains any global state changes.

### initialState

```javascript
{
  isAppReady: false,
  error: ''
}
```

### fields

- `isAppReady` _boolean_ -- Did the app fetch all required assets and initialize required subscriptions.
- `error` _string_ -- String of the most recent error message.

## auth

### description

The auth state is responsible for managing updates to authentication.

### initialState

```javascript
{
  userId: '',
  isAuthenticated: false,
  hasAccessToken: false,
  isSigningOut: false
}
```

### fields

- `user` _string_ -- The current user's firebase-generated uuid.
- `isAuthenticated` _boolean_ -- Whether the user is authenticated.
- `hasAccessToken` _boolean_ -- Whether the user's authentication token is saved in group-accessible storage. This is necessary for app and app extension to share login credentials.
- `isSigningOut` _boolean_ -- Did the user initiate a logout.

## users

### description

The users state is a collection of user objects relevant to the currently logged in user's experience. It is a combination of self, friends, and potentially friends of friends.

### initialState

```javascript
{
  'userIdA': {
    userId: '',
    facebookProfilePhoto: '',
    firstName: '',
    lastName: ''
  },
  'userIdB': {
    userId: '',
    facebookProfilePhoto: '',
    firstName: '',
    lastName: ''
  }
}
```

### fields

- `userId` _string_ -- The user's firebase-generated uuid.
- `facebookProfilePhoto` _string_ -- The user's facebook profile photo url.
- `firstName` _string_ -- The user's first name.
- `lastName` _string_ -- The user's last name.

## usersLists

### description

The usersLists state is contains a variety of lists of userIds relevant to the current user's experience.

### initialState

```javascript
{
  userIdA_Friends: ['userIdA', 'userIdB', 'userIdC', ...],
  userIdA_GroupA: ['userIdA', 'userIdB', 'userIdC', ...],
  userIdA_GroupB: ['userIdA', 'userIdB', 'userIdC', ...],

  userIdB_Friends: ['userIdA', 'userIdB', 'userIdC', ...],
  userIdB_GroupA: ['userIdA', 'userIdB', 'userIdC', ...],
  userIdB_GroupB: ['userIdA', 'userIdB', 'userIdC', ...],

  ...
}
```

### fields

- `userId` _string_ -- The user's firebase-generated uuid.

## friendships

### description

The friendships state is a collection of the current user's friend requests and their status.

### initialState

```javascript
{
  friendshipId: {
    createdAt: null,
    initiatingUserId: '',
    receivingUserId: '',
    status: '',
    updatedAt: null,
    userIds: [
      'userIdA',
      'userIdB',
    ]
  }
}
```

### fields

- `createdAt` _timestamp_
- `initiatingUserId` _string_ -- The initiating user's firebase-generated uuid.
- `receivingUserId` _string_ -- The receiving user's firebase-generated uuid.
- `status` _string_ ["pending", "accepted", "rejected"] -- The current friendship status.
- `updatedAt` _timestamp_
- `userIds` _Array\<string\>_ -- The list of userIds involved in a friendship object.

## routing

### description

The routing state helps handle dynamic link routing.

### initialState

```javascript
{
  url: '',
  protocol: '',
  hostname: '',
  screen: '',
  params: {},
}
```

### fields

- `url` _string_ -- The original url of the route.

## usersPosts

### description

The usersPosts state is a collection of usersPosts objects relevant to the currently logged in user's experience. It is a merged object of any usersPosts fetched from various database queries.

### initialState

```javascript
{
  'userPostIdA': {
    addCount: 0,
    adds: [],
    createdAt: null,
    description: '',
    doneCount: 0,
    dones: [],
    image: '',
    likeCount: 0,
    likes: [],
    medium: '',
    postId: '',
    publisher: {
      logo: '',
      name: ''
    },
    shareCount: 0,
    shares: [],
    title: '',
    updatedAt: null,
    url: '',
    userId: ''
  },
  'userPostIdB': {
    addCount: 0,
    adds: [],
    createdAt: null,
    description: '',
    doneCount: 0,
    dones: [],
    image: '',
    likeCount: 0,
    likes: [],
    medium: '',
    postId: '',
    publisher: {
      logo: '',
      name: ''
    },
    shareCount: 0,
    shares: [],
    title: '',
    updatedAt: null,
    url: '',
    userId: ''
  }
}
```

### fields

- `addCount` _number_ -- Total number of global adds on a post.
- `adds` _Array\<string\>_ -- An array of userIds from friends that have added a post.
- `createdAt` _timestamp_
- `description` _string_ -- Scraped description about a post.
- `doneCount` _number_ -- Total number of global dones on a post.
- `dones` _Array\<string\>_ -- An array of userIds from friends that have marked a post as done.
- `image` _string_ -- Scraped image for a post.
- `likeCount` _number_ -- Total number of global likes on a post.
- `likes` _Array\<string\>_ -- An array of userIds from friends that have liked a post.
- `medium` _string_ -- The type of content.
- `postId` _string_ -- Unique ID for the original post.
- `publisher.logo` _string_ -- Scraped image for a publisher.
- `publisher.name` _string_ -- Scraped name of the publisher.
- `shareCount` _number_ -- Total number of global shares on a post.
- `shares` _Array\<string\>_ -- An array of userIds from friends that have shared a post.
- `title` _string_ -- Scraped title of the post.
- `updatedAt` _timestamp_
- `url` _string_ -- Original url of the post.
- `userId` _string_ -- The unique ID of the user whose feed contained the post.

## usersPostsLists

### description

The usersPostsLists state is a collection of lists that represent various views populated by usersPosts objects.

### initialState

```javascript
{
  userIdA_posts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  userIdA_posts_done: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  userIdA_posts_shared: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  userIdA_posts_shared_product: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],

  userIdB_posts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  userIdB_posts_done: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  userIdB_posts_shared: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  userIdB_posts_shared_product: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],

  ...
}
```

### fields

- `userPostId` _string_ -- The userPost unique ID.
