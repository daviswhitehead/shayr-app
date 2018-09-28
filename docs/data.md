# Collections
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
### Rules
#### `onCreate()`  
Future
  - Notify users who are facebook friends with this user that they've joined shayr

### Sub Collections
#### [Shares](#userShares)
`users/{userId}/shares/{shareId}`
#### Adds
`users/{userId}/adds/{addId}`
#### Dones
`users/{userId}/dones/{doneId}`
#### Likes
`users/{userId}/likes/{likeId}`
#### Feed
`users/{userId}/feed/{postId}`

---
## userShares
`users/{userId}/shares/{shareId}`
### Spec
```
{
  createdAt (timestamp),
  post (reference),
  share (reference),
  updatedAt (timestamp),
  visible (boolean),
}
```
### Sample
```
{
  createdAt: ts,
  post: 'posts/0',
  share: 'shares/0',
  updatedAt: ts,
  visible: true,
}
```
### Rules
#### `onCreate(users/{userId}/shares/{shareId})`
#### `onWrite(users/{userId}/shares/{shareId})`
