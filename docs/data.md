# queries

- get all of a user's friends
  - `db.collection('friends').where('users', 'array-contains', '${userId}').where('status', '==', 'accepted')`
- get all of a user's (shared, added, doned, liked) posts
  - `db.collection('users_posts').where('userId', '==', '${userId}').where('shares', 'array-contains', ${userId})`
  - `db.collection('users_posts').where('userId', '==', '${userId}').where('adds', 'array-contains', ${userId})`
- get all of a user's friends' (shared, added, doned, liked) posts
  - if `friend's userId`: `db.collection('users_posts').where('userId', '==', '${userId}').where('shares', 'array-contains', ${userId})`
- get all total (shares, adds, dones, likes) of a post
  - `[action]Count` field in `Post` documents
- get total (shares, adds, dones, likes) of a post within a user's friends
  - frontend: count friends in array for `Post` in `users_posts`
- get the names of all the friends who (shared, added, doned, liked) a post
  - frontend: merge friends object with `Post` [action] arrays in `users_posts`
- get all / filter posts from the same publisher
  - `db.collection('posts').where('publisherName', '==', 'nytimes')`
- get all / filter posts from the same tag
  - `db.collection('users_posts').where('tags', 'array-contains', 'business')`
- get all / filter posts from the same medium
  - `db.collection('users_posts').where('medium', '==', 'poscast')`

# sets

- perform an action on a post
  - `db.collection('friends').where('users', 'array-contains', '${userId}').where('status', '==', 'accepted')`
- get all of a user's (shared, added, doned, liked) posts
  - `db.collection('users_posts').where('userId', '==', '${userId}').where('shares', 'array-contains', ${userId})`
  - `db.collection('users_posts').where('userId', '==', '${userId}').where('adds', 'array-contains', ${userId})`
- get all of a user's friends' (shared, added, doned, liked) posts
  - if `friend's userId`: `db.collection('users_posts').where('userId', '==', '${userId}').where('shares', 'array-contains', ${userId})`
- get all total (shares, adds, dones, likes) of a post
  - `[action]Count` field in `Post` documents
- get total (shares, adds, dones, likes) of a post within a user's friends
  - frontend: count friends in array for `Post` in `users_posts`
- get the names of all the friends who (shared, added, doned, liked) a post
  - frontend: merge friends object with `Post` [action] arrays in `users_posts`
- get all / filter posts from the same publisher
  - `db.collection('posts').where('publisherName', '==', 'nytimes')`
- get all / filter posts from the same tag
  - `db.collection('users_posts').where('tags', 'array-contains', 'business')`
- get all / filter posts from the same medium
  - `db.collection('users_posts').where('medium', '==', 'poscast')`

# functions

- `onCreate('users/{userId}/inboundShares/{shareId}')`
- `onWrite('posts/{postId}')`
- `onWrite('shares/{userId}_{postId}')`
- `onWrite('adds/{userId}_{postId}')`
- `onWrite('dones/{userId}_{postId}')`
- `onWrite('likes/{userId}_{postId}')`

# data flow

## inbound share

1. `onCreate('users/{userId}/inboundShares/{shareId}')`
1. scrape url data
1. match to `Post` or create a new `Post`
1. write `Post` with scraped data
1. write `Share` for `User` `Post`
1. write `inboundShare` with `PostId`
1. `onWrite('shares/{userId}_{postId}')` input: `createdAt, updatedAt, url, user`
1. write `Post` with new [action] count
1. write `Post` to `users_posts` for self and friends
1. update array of users [action]ing the matching `Post`s in `users_posts` object
1. if new: send a notification to followers
1. `onWrite('posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
1. write `Post` updates to matching `Post`s in all `users_posts`

## post actions

actions: [share, add, done, like]

1. `onWrite('[action]/{userId}_{postId}')`
1. write `Post` with new [action] count
1. write `Post` to `users_posts` for self and friends
1. update array of users [action]ing the matching `Post`s in `users_posts` object
1. if new:
   1. [share] send notification to all friends
   1. [done, like] send notification to any friends who have shared the post
1. `onWrite('posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
1. write `Post` updates to matching `Post`s in all `users_posts`

# collections

- [adds](#adds)
- [dones](#dones)
- [friends](#friends)
- [likes](#likes)
- [posts](#posts)
- [shares](#shares)
- [users](#users)
  - [inboundShares](#inboundshares)
- [users_posts](#users_posts)

## adds

`adds/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. user performs add action  
   fields: `active, createdAt, postId, updatedAt, userId`

1. at any point, a user can un-add a post  
   fields: `active, updatedAt`

## dones

`dones/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. user performs done action  
   fields: `active, createdAt, postId, updatedAt, userId`

1. at any point, a user can un-done a post  
   fields: `active, updatedAt`

## friends

`friends/{initiatingUserId}_{receivingUserId}`

### fields

```
{
 createdAt (timestamp),
 initiatingUserId (string),
 receivingUserId (string),
 status (string) [pending, accepted, rejected],
 updatedAt (timestamp),
 userIds (array),
}
```

## likes

`likes/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. user performs like action  
   fields: `active, createdAt, postId, updatedAt, userId`

1. at any point, a user can un-like a post  
   fields: `active, updatedAt`

## posts

`posts/{postId}`

### fields

```
{
 addCount (number),
 createdAt (timestamp),
 description (string),
 doneCount (number),
 image (string),
 likeCount (number),
 medium (string),
 publisher {
   logo (string),
   name (string)
 },
 shareCount (number),
 title (string),
 updatedAt (timestamp),
 url (string),
}
```

### sample

```
{
 createdAt: ts,
 description: 'The question at the heart of this gamble is: are people really going to hang out in virtual reality?',
 image: 'https://wp-assets.futurism.com/2018/06/realestate-600x315.png',
 medium: 'article',
 publisher: {
   logo: 'https://www.thearcticinstitute.org/wp-content/uploads/2017/12/Futurism_logo.png',
   name: 'Futurism'
 },
 shareCount: 10,
 title: 'People are paying insane amounts of real money for "virtual real estate"',
 updatedAt: ts,
 url: 'https://futurism.com/virtual-real-estate/amp/',
}
```

### lifecycle

1. `onWrite(shares/{userId}_{postId})` creates a new post  
   fields: `createdAt, description, image, medium, publisher, title, updatedAt, url`

1. `onWrite([ shares/{userId}_{postId} or adds/{addId} or dones/{doneId} or likes/{likeId} ])` counts the total actions on the post  
   fields: `shareCount, addCount, doneCount, likeCount`

### atom

```
{
  addCount (number),
  description (string),
  doneCount (number),
  image (string),
  likeCount (number),
  medium (string),
  publisher {
    logo (string),
    name (string)
  },
  shareCount (number),
  title (string),
  url (string),
}
```

## shares

`shares/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  url (string),
  userId (string),
}
```

### lifecycle

1. created after processing an inboundShare
   fields: `active, createdAt, updatedAt, url, userId`

1. `onWrite(shares/{userId}_{postId})`  
   fields: `postId, updatedAt`

## users

`users/{userId}`

### fields

```
{
  createdAt (timestamp),
  email (string),
  facebookProfilePhoto (string),
  firstName (string),
  lastName (string),
  updatedAt (timestamp),
}
```

### lifecycle

1. created upon first login  
   fields: `createdAt, email, facebookProfilePhoto, firstName, lastName, updatedAt`

1. updated every subsequent login  
   fields: `email, facebookProfilePhoto, firstName, lastName, updatedAt`

### atom

```
{
  facebookProfilePhoto (string),
  firstName (string),
  lastName (string),
}
```

## inboundShares

`users/{userId}/inboundShares/{shareId}`

### fields

```
{
  createdAt (timestamp),
  postId: (string),
  updatedAt (timestamp),
  url (string),
}
```

### lifecycle

1. user creates a new share (from share extension)  
   fields: `createdAt, updatedAt, url`

1. gets update by cloud function after matching  
   fields: `postId`

## users_posts

`users_posts/{userId}_{postId}`

### fields

```
{
  adds (array) [userIdA, userIdB],
  createdAt (timestamp),
  dones (array) [userIdA, userIdB],
  likes (array) [userIdA, userIdB],
  ...posts (atom),
  shares (array) [userIdA, userIdB],
  updatedAt (timestamp)
  userId (string),
}
```

### lifecycle

1. created or written whenever a user or one of their friends performs an action [share, add, done, like] on a post

# resources

- [excellent synopsis of modeling various relationships in nosql](https://angularfirebase.com/lessons/firestore-nosql-data-modeling-by-example/)
- [docs for basic firestore queries](https://firebase.google.com/docs/firestore/query-data/queries)
