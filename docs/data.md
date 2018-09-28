# Collections
- [Users](#users)
  - [userShares](#usershares)
  - [userAdds](#useradds)
  - [userDones](#userdones)
  - [userLikes](#userlikes)
  - [userFeed](#userfeed)
- [Friends](#friends)
- [Posts](#posts)
  - [postShares](#postshares)

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
### Sample
```
{
  createdAt: ts,
  email: 'chillywilly.bootato@gmail.com',
  facebookProfilePhoto: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
  firstName: 'Bob',
  lastName: 'Sanders',
  updatedAt: ts,
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

---
## userShares
`users/{userId}/shares/{shareId}`
### Spec
```
{
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  url (reference),
  user (reference),
  visible (boolean),
}
```
### Sample
```
{
  createdAt: ts,
  post: 'posts/0',
  updatedAt: ts,
  url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb',
  user: 'users/0',
  visible: true,
}
```
### Lifecycle
1. user creates a new share (from share extension)  
fields: `createdAt, updatedAt, url, user, visible`  

1. `onCreate(users/{userId}/shares/{shareId})`  
fields: `post, updatedAt`

1. at any point, a user can un-share a post  
fields: `visible, updatedAt`

### Rules
#### `onCreate()`  
Current
- match with an existing post or create a new post
- create a new post share
- update post with new count
- update share with post ref
- add post data to feed for self and followers
- send a notification to followers
#### `onUpdate()`
Current
- update post with new count
- update share data of post in feeds

---
## userAdds
`users/{userId}/adds/{addId}`
### Spec
```
{
  createdAt (timestamp),
  done (boolean),
  post (reference),
  updatedAt (timestamp),
  visible (boolean),
}
```
### Sample
```
{
  createdAt: ts,
  done: false,
  post: 'posts/0',
  updatedAt: ts,
  visible: true,
}
```
### Lifecycle
1. user performs add action  
fields: `createdAt, done, post, updatedAt, visible`  

1. `onCreate(users/{userId}/shares/{shareId})`  
fields: `post, updatedAt`

1. at any point, a user can un-share a post  
fields: `visible, updatedAt`

### Rules
#### `onWrite()`
Current
- update post with new count
- update add data of post in feeds

---
## userDones
`users/{userId}/dones/{doneId}`
### Spec
```
{
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  visible (boolean),
}
```
### Sample
```
{
  createdAt: ts,
  post: 'posts/0',
  updatedAt: ts,
  visible: true,
}
```
### Rules
#### `onWrite()`
Current
- update post with new count
- update done data of post in feeds
- update add data of post for user
- if new: send a notification to original sharer

---
## userLikes
`users/{userId}/likes/{likeId}`
### Spec
```
{
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  visible (boolean),
}
```
### Sample
```
{
  createdAt: ts,
  post: 'posts/0',
  updatedAt: ts,
  visible: true,
}
```
### Rules
#### `onWrite()`
Current
- update post with new count
- update like data of post in feeds
- if new: send a notification to original sharer

---
## userFeed
`users/{userId}/feeds/{postId}`

### Spec
```
{
  ...post,
  post: 'posts/0',
}
```
### Sample
```
{
  TBD
}
```
### Rules
#### `onWrite()`
Current
- update post with new count
- update like data of post in feeds
- if new: send a notification to original sharer

---
## Shares
`shares/{shareId}`
### Spec
```
{
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  url (string),
  user (reference),
}
```
### Sample
```
{
  createdAt: ts,
  post: 'posts/0',
  updatedAt: ts,
  url: 'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb',
  user: 'users/0',
}
```
### Lifecycle
1. user creates a new share (from share extension)  
fields: `createdAt, updatedAt, url, user`  

1. `onCreate(shares/{shareId})`  
fields: `post, updatedAt`

### Rules
#### `onCreate()`  
Current
- match with an existing post or create a new post
- create a new post share
- update share with post ref

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
1. `onCreate(shares/{shareId})` creates a new post   
fields: `createdAt, updatedAt, url`

1. `onCreate(shares/{shareId})` creates a new post share   

1. `onCreate(posts/{postId}/shares/{shareId})` scrapes meta data for new post share and updates original post   
fields: `description, image, medium, publisher, title, updatedAt, url`

1. `onWrite(users/{userId}/[ shares/{shareId} or adds/{addId} or dones/{doneId} or likes/{likeId} ])` counts the total actions on the post   
fields: `shareCount, addCount, doneCount, likeCount`


### Rules
#### `onCreate()`  
Current
- match with an existing post or create a new post
- create a new post share
- update share with post ref

### Sub Collections
#### [Shares](#postshares)
`posts/{postId}/shares/{shareId}`

---
## postShares
`posts/{postId}/shares/{shareId}`
### Spec
```
{
  createdAt (timestamp),
  normalUrl (string),
  share (reference),
  updatedAt (timestamp),
  url (string),
  user (reference),
}
```
### Sample
```
{
  createdAt: ts,
  share: 'shares/0',
  updatedAt: ts,
  user: 'users/0',
  visible: true,
}
```

### Lifecycle


### Rules
#### `onCreate()`  
Current
- match with an existing post or create a new post
- create a new post share
- update share with post ref

### Sub Collections
#### [Shares](#postshares)
`posts/{postId}/shares/{shareId}`
