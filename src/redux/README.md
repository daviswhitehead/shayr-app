# Application State

## root

### description

### initialState

```javascript
{
  app: {},
  authentication: {},
  users: {},
  posts: {},
  routing: {}
}
```

<!-- <details>
<summary>Authentication</summary> -->

## app

### description

The app state contains any global state changes.

### initialState

```javascript
{
  listenersReady: false,
  error: ''
}
```

### fields

- `listenersReady` _boolean_ -- Did the app fetch all required assets and initialize required subscriptions.
- `error` _string_ -- String of the most recent error message.

## authentication

### description

The authentication state is responsible for managing updates to authentication.

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

## friends

### description

The friends state is a list of the current user's friends's userIds.

### initialState

```javascript
['userIdA', 'userIdB', 'userIdC', ...]
```

### fields

- `userId` _string_ -- The user's firebase-generated uuid.

## friendships

### description

The friends state is a list of the current user's friends's userIds.

### initialState

```javascript
{
  friendshipId: {
    initiatingUserId: '',
    receivingUserId: '',
    status: '',
    updatedAt: null,
    createdAt: null
  }
}
```

### fields

- `initiatingUserId` _string_ -- The initiating user's firebase-generated uuid.
- `receivingUserId` _string_ -- The receiving user's firebase-generated uuid.
- `status` _string_ ["pending", "accepted", "rejected"] -- The current friendship status.
- `updatedAt` _timestamp_
- `createdAt` _timestamp_

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

## posts

### description

The posts state is a collection of post objects relevant to the currently logged in user's experience. It is a merged object of any posts fetched from various database queries.

### initialState

```javascript
{
  'userPostIdA': {
    userPostId: '',
    postId: '',
  },
  'userPostIdB': {
    userPostId: '',
    postId: '',
  }
}
```

### fields

- `url` _string_ -- The original url of the route.

## postLists

### description

The posts state is a collection of post objects relevant to the currently logged in user's experience. It is a merged object of any posts fetched from various database queries.

### initialState

```javascript
{
  'userPostIdA': {
    userPostId: '',
    postId: '',
  },
  'userPostIdB': {
    userPostId: '',
    postId: '',
  }
}
```

### fields

- `url` _string_ -- The original url of the route.
