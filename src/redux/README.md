# Application State

## root

### description

### initialState

```javascript
{
  adds: {},
  app: {},
  auth: {},
  dones: {},
  friendships: {},
  friendshipsLists: {},
  likes: {},
  newShare: {},
  routing: {},
  shares: {},
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
  user: '',
  hasAccessToken: false,
  isSigningOut: false
}
```

### fields

- `user` _object_ -- The current user's firebase-generated object. `user.uid` returns the current user's `userId`.
- `hasAccessToken` _boolean_ -- Whether the user's authentication token is saved in group-accessible storage. This is necessary for app and app extension to share login credentials.
- `isSigningOut` _boolean_ -- Did the user initiate a logout.

### notes

A user is considered authenticated when there is a user object and hasAccessToken is true.

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
  userIdA_Friends: {
    isLoaded: true,
    items: ['userIdA', 'userIdB', 'userIdC', ...]
  },
  userIdA_GroupA:  {
    isLoaded: true,
    items: ['userIdA', 'userIdB', 'userIdC', ...],
  },
  userIdA_GroupB:  {
    isLoaded: true,
    items: ['userIdA', 'userIdB', 'userIdC', ...],
  },

  userIdB_Friends:  {
    isLoaded: true,
    items: ['userIdA', 'userIdB', 'userIdC', ...],
  },
  userIdB_GroupA:  {
    isLoaded: true,
    items: ['userIdA', 'userIdB', 'userIdC', ...],
  },
  userIdB_GroupB:  {
    isLoaded: true,
    items: ['userIdA', 'userIdB', 'userIdC', ...],
  },

  ...
}
```

### fields

- `isLoaded` _object_ -- Keys map to each list of `userId`'s and the value is `true` when loaded. This is helpful to avoid extra frontend rendering.
- `userId` _string_ -- The user's firebase-generated uuid.

## friendshipsLists

### description

The friendshipsLists state is contains a set of lists of friendshipIds relevant to the current user's experience.

### initialState

```javascript
{
  userIdA: {
    isLoaded: true,
    items: ['friendshipsIdA', 'friendshipsIdB', 'friendshipsIdC', ...]
  },
  userIdB: {
    isLoaded: true,
    items: ['friendshipsIdA', 'friendshipsIdB', 'friendshipsIdC', ...]
  },
  userIdC: {
    isLoaded: true,
    items: ['friendshipsIdA', 'friendshipsIdB', 'friendshipsIdC', ...]
  },

  ...
}
```

### fields

- `isLoaded` _object_ -- Keys map to each list of `userId`'s and the value is `true` when loaded. This is helpful to avoid extra frontend rendering.
- `friendshipsId` _string_ -- The friendship's firebase-generated uuid.

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
- `isLoaded` _object_ -- Keys map to each `userId` who the app has pulled friendships for and the value is `true` when loaded. This is helpful to avoid extra frontend rendering.

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
    addsCount: 0,
    adds: [],
    createdAt: null,
    description: '',
    donesCount: 0,
    dones: [],
    image: '',
    likesCount: 0,
    likes: [],
    medium: '',
    postId: '',
    publisher: {
      logo: '',
      name: ''
    },
    sharesCount: 0,
    shares: [],
    title: '',
    updatedAt: null,
    url: '',
    userId: ''
  },
  'userPostIdB': {
    addsCount: 0,
    adds: [],
    createdAt: null,
    description: '',
    donesCount: 0,
    dones: [],
    image: '',
    likesCount: 0,
    likes: [],
    medium: '',
    postId: '',
    publisher: {
      logo: '',
      name: ''
    },
    sharesCount: 0,
    shares: [],
    title: '',
    updatedAt: null,
    url: '',
    userId: ''
  }
}
```

### fields

- `addsCount` _number_ -- Total number of global adds on a post.
- `adds` _Array\<string\>_ -- An array of userIds from friends that have added a post.
- `createdAt` _timestamp_
- `description` _string_ -- Scraped description about a post.
- `donesCount` _number_ -- Total number of global dones on a post.
- `dones` _Array\<string\>_ -- An array of userIds from friends that have marked a post as done.
- `image` _string_ -- Scraped image for a post.
- `likesCount` _number_ -- Total number of global likes on a post.
- `likes` _Array\<string\>_ -- An array of userIds from friends that have liked a post.
- `medium` _string_ -- The type of content.
- `postId` _string_ -- Unique ID for the original post.
- `publisher.logo` _string_ -- Scraped image for a publisher.
- `publisher.name` _string_ -- Scraped name of the publisher.
- `sharesCount` _number_ -- Total number of global shares on a post.
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
  userIdA_posts: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdA_posts_done: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdA_posts_shared: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdA_posts_shared_product: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdB_posts: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdB_posts_done: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdB_posts_shared: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  userIdB_posts_shared_product: {
    isLoaded: true,
    isLoading: true,
    isEmpty: true,
    isLoadedAll: true,
    isRefreshing: false,
    isPaginating: false,
    lastPost: 'userPostIdX',
    usersPosts: ['userPostIdA', 'userPostIdB', 'userPostIdC', ...],
  },

  ...
}
```

### fields

- `userPostId` _string_ -- The userPost unique ID.

## newShare

### description

The newShare state is a collection of lists that represent various views populated by usersPosts objects.

### initialState

```javascript
{
  [{shareId}]: {
    status: 'started' | 'confirmed' | 'canceled',
    comment: '',
    createdAt: null,
    mentions: ['userIdA', 'userIdB', ...],
    payload: '',
    postId: 'postId',
    updatedAt: null,
    url: '',
    userId: 'userId',
    _isPostLoading: false,
  },
}
```

### fields

- `userPostId` _string_ -- The userPost unique ID.
