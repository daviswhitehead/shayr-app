# Functions Lifecycle

## Inbound Share

1. `onCreate('shares/{shareId}')` input: `createdAt, updatedAt, url, user`
1. scrape url data
1. match to `Post` or create a new `Post`
1. write `Post` with scraped data
1. get `userShare`
1. write `userShare`
1. write `Share` with `Post` reference
1. `onWrite('users/{userId}/shares/{shareId}')` input: `createdAt, post, updatedAt, url, user, active`
1. write `Post` with new share count
1. write `Post` to `userPosts` for self and friends
1. create or update `userPostsShares` document to matching `Post` in `userPosts` for self and friends
1. update `userShare` field for matching `Post` in self `userPosts`
1. if new: send a notification to followers
1. `onWrite('posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
1. write `Post` updates to matching `Posts` in all `userPosts`

<!-- 1. `onWrite('users/{userId}/posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
  1. write `Post` updates to matching `Posts` in self `userFeed` and `userQueue` -->

## Post Actions

actions: [share, add, done, like]

1. `onWrite('users/{userId}/[action]/{[action]Id}')` input: `active, createdAt, post, updatedAt,`
1. write `Post` with new [action] count
1. [if new: share] write `Post` to `userPosts` for self and friends
1. [if new: share] write `Post` to `userFeed` for self and friends
1. create or update `userPosts[Actions]` document to matching `Post` in `userPosts` for self and friends
1. update `user[Action]` field for matching `Post` in self `userPosts`
1. if new: [share] send notification to all friends
1. if new: [done, like] send notification to any friends who have shared the post
1. `onWrite('posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
1. write `Post` updates to matching `Posts` in all `userPosts`

<!-- 1. `onWrite('users/{userId}/posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
  1. write `Post` updates to matching `Posts` in self `userFeed` and `userQueue` -->

## Add to Queue

triggered by frontend

- add --> copy `Post` from `userPosts` to `userQueue`
- done --> remove `Post` from `userQueue`

# Collections

- [adds](#adds)
- [dones](#dones)
- [friends](#friends)
- [likes](#likes)
- [posts](#posts)
- [shares](#shares)
- [users](#users)
- [users_posts](#users_posts)

---

## Shares

`shares/{shareId}`

### Spec

```
{
  active (boolean),
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  url (string),
  user (reference),
}
```

### Lifecycle

1. user creates a new share (from share extension)  
   fields: `active, createdAt, updatedAt, url, user`

1. `onCreate(shares/{shareId})`  
   fields: `post, updatedAt`

1. `onWrite(shares/{shareId})`  
   TBD

---

## Users

`users/{userId}`

### Spec

```
{
  createdAt (timestamp),
  email (string),
  facebookProfilePhoto (string),
  firstName (string),
  lastName (string),
  updatedAt (timestamp)
}
```

### Lifecycle

1. created upon first login  
   fields: `createdAt, email, facebookProfilePhoto, firstName, lastName, updatedAt`

1. updated every subsequent login  
   fields: `email, facebookProfilePhoto, firstName, lastName, updatedAt`

### Rules

#### `onCreate()`

Future

- Notify users who are facebook friends with this user that they've joined shayr
- Update userFriends for anyone who's already friends with a user if they change their information

### Sub Collections

#### [userShares](#usershares)

`users/{userId}/shares/{shareId}`

#### [userAdds](#useradds)

`users/{userId}/adds/{addId}`

#### [userDones](#userdones)

`users/{userId}/dones/{doneId}`

#### [userLikes](#userlikes)

`users/{userId}/likes/{likeId}`

#### [userFeed](#userfeed)

`users/{userId}/feed/{postId}`

#### [userFriends](#userfriends)

`users/{userId}/friends/{friendshipId}`

---

## userShares

`users/{userId}/shares/{shareId}`

### Spec

```
{
  active (boolean),
  createdAt (timestamp),
  post (reference),
  share (reference),
  updatedAt (timestamp),
}
```

### Lifecycle

1. user creates a new share (from share extension), `onCreate(shares/{shareId})`  
   fields: `active, createdAt, post, share, updatedAt`

1. at any point, a user can un-share a post  
   fields: `active, updatedAt`

### Rules

#### `onWrite()`

TBD

Current

- match with an existing post or create a new post
- create a new post share
- update post with new count
- update share with post ref
- add post data to feed for self and followers
- update post data in self feed
- send a notification to followers

#### `onUpdate()`

Current

- update post with new count
- update share data of post in feeds
- update post data in self feed

### Notes

- Shares the same `{shareId}` with `shares/{shareId}`

---

## userAdds

`users/{userId}/adds/{addId}`

### Spec

```
{
  active (boolean),
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
}
```

### Lifecycle

1. user performs done action  
   fields: `createdAt, done, post, updatedAt, active`

1. at any point, a user can un-done a post  
   fields: `active, updatedAt`

### Rules

#### `onWrite()`

Current

- update post with new count
- update add data of post in feeds
- update post data in self feed

---

## userDones

`users/{userId}/dones/{doneId}`

### Spec

```
{
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  active (boolean),
}
```

### Lifecycle

1. user performs done action  
   fields: `createdAt, post, updatedAt, active`

1. at any point, a user can un-done a post  
   fields: `active, updatedAt`

### Rules

#### `onCreate()`

Current

- update post with new count
- update done data of post in feeds
- update add data of post for user
- update post data in self feed
- if new: send a notification to original sharer

#### `onUpdate()`

Current

- update post with new count
- update done data of post in feeds
- update add data of post for user
- update post data in self feed

---

## userLikes

`users/{userId}/likes/{likeId}`

### Spec

```
{
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  active (boolean),
}
```

### Lifecycle

1. user performs like action  
   fields: `createdAt, post, updatedAt, active`

1. at any point, a user can un-like a post  
   fields: `active, updatedAt`

### Rules

#### `onCreate()`

Current

- update post with new count
- update like data of post in feeds
- update post data in self feed
- if new: send a notification to original sharer

#### `onWrite()`

Current

- update post with new count
- update like data of post in feeds
- update post data in self feed

---

## userFeed

`users/{userId}/feed/{postId}`

### Spec

```
{
  ...post (atom),
  post (reference),
  userShare (boolean),
  userAdd (boolean),
  userDone (boolean),
  userLike (boolean),
  sharedByFirstName (string),
  sharedByLastName (string),
  sharedByFacebookProfilePhoto (string)
}
```

### Lifecycle

1. post gets added to user's feed from follower or self share  
   fields: `post (atom), post, userShare, userAdd, userDone, userLike`

1. post gets update  
   fields: `post (atom)`

1. user performs (share, add, done, like) action  
   fields: `userShare, userAdd, userDone, userLike`

### Rules

None

### Sub Collections

#### [userFeedShares](#userfeedshares)

`users/{userId}/feed/{postId}/shares/{shareId}`

#### [userFeedAdds](#userfeedadds)

`users/{userId}/feed/{postId}/adds/{addId}`

#### [userFeedDones](#userfeeddones)

`users/{userId}/feed/{postId}/dones/{doneId}`

#### [userFeedLikes](#userfeedlikes)

`users/{userId}/feed/{postId}/likes/{likeId}`

---

## userFeedShares

`users/{userId}/feed/{postId}/shares/{shareId}`

### Spec

```
{
  active (boolean),
  updatedAt (timestamp),
  user (reference),
  userFirstName (string),
  userLastName (string),
  userFacebookProfilePhoto (string)
}
```

### Lifecycle

1. Whenever a `userShare` is written, `userFeedShare` is written
   fields: `all`

### Rules

None

### Notes

- Shares the same `{shareId}` with `users/{userId}/shares/{shareId}` and `shares/{shareId}`

---

## userFriends

`users/{userId}/friends/{friendshipId}`

### Spec

```
{
  friendship (reference),
  friendshipStatus (string) [pending, accepted, rejected],
  user (reference),
  userFirstName (string),
  userLastName (string),
  userFacebookProfilePhoto (string)
}
```

### Lifecycle

1. gets updated anytime a friendship is written, `onWrite('friends/{friendshipId}')`  
   fields: `all`

1. gets updated anytime a user is updated, `onWrite('users/{userId}')`  
   fields: `user (atom)`

### Rules

None

---

## Posts

`posts/{postId}`

### Spec

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

### Sample

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

### Lifecycle

1. `onCreate(users/{userId}/shares/{shareId})` creates a new post  
   fields: `createdAt, updatedAt, url`

1. `onCreate(posts/{postId}/shares/{shareId})` scrapes meta data for new post share and updates original post  
   fields: `description, image, medium, publisher, title, updatedAt, url`

1. `onWrite(users/{userId}/[ shares/{shareId} or adds/{addId} or dones/{doneId} or likes/{likeId} ])` counts the total actions on the post  
   fields: `shareCount, addCount, doneCount, likeCount`

### Rules

#### `onWrite()`

Current

- update any documents in `users/{userId}/feed/{feedId}` with a matching post reference

### Sub Collections

#### [Shares](#postshares)

`posts/{postId}/shares/{shareId}`

---

## Friends

`friends/{friendshipId}`

### Spec

```
{
  createdAt (timestamp),
  initiatingUser (reference),
  receivingUser (reference),
  status (string) [pending, accepted, rejected],
  updatedAt (timestamp),
}
```

### Lifecycle

None

### Rules

#### `onWrite()`

Current

- create userFriend documents
