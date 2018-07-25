# Data Model

### Current
```
users/{user} {
  createdAt (timestamp),
  email (string),
  firstName (string),
  lastName (string),
  updatedAt (timestamp)

  shares/{share} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    url (string)
  }

  savedPosts/{post} {
    createdAt (timestamp),
    deletedAt (timestamp),
    doneAt (timestamp),
    updatedAt (timestamp)
  }
}

posts/{post} {
  createdAt (timestamp),
  description (string),
  image (string),
  medium (string),
  publisher {
    logo (string),
    name (string)
  },
  title (string),
  updatedAt (timestamp),
  url (string)

  shares/{share} {
    createdAt (timestamp),
    updatedAt (timestamp)
    url (string),
    user (reference)
  }
}
```

### Future
```
users/{user} {
  createdAt (timestamp),
  email (string),
  firstName (string),
  friends [
    {user} (reference),
    {user} (reference)
  ],
  lastName (string),
  updatedAt (timestamp)

  shares/{share} {
    createdAt (timestamp),
    post (reference),
    tags [
      {tag} (reference),
      {tag} (reference)
    ],
    updatedAt (timestamp),
    url (string),
    visible (boolean)
  }

  postsMeta/{post} {
    addCreatedAt (timestamp),
    addUpdatedAt (timestamp),
    addVisible (boolean),
    doneCreatedAt (timestamp),
    doneUpdatedAt (timestamp),
    doneVisible (boolean),
    likeCreatedAt (timestamp),
    likeUpdatedAt (timestamp),
    likeVisible (boolean),
  }
}

friends/{friendship} {
  createdAt (timestamp),
  deletedAt (timestamp),
  initiatingUser (reference),
  receivingUser (reference),
  status (string) [pending, accepted, rejected],
  updatedAt (timestamp)
}

tags/{tag} {
  createdAt (timestamp),
  posts [
    {post} (reference),
    {post} (reference)
  ],
  updatedAt (timestamp)
}

posts/{post} {
  createdAt (timestamp),
  description (string),
  image (string),
  medium (string),
  publisher {
    logo (string),
    name (string)
  },
  title (string),
  updatedAt (timestamp),
  url (string)

  shares/{share} {
    createdAt (timestamp),
    tags [
      {tag} (reference),
      {tag} (reference)
    ],
    updatedAt (timestamp),
    url (string),
    user (reference),
    visible (boolean)
  }

  usersMeta/{user} {
    addCreatedAt (timestamp),
    addUpdatedAt (timestamp),
    addVisible (boolean),
    doneCreatedAt (timestamp),
    doneUpdatedAt (timestamp),
    doneVisible (boolean),
    likeCreatedAt (timestamp),
    likeUpdatedAt (timestamp),
    likeVisible (boolean),
  }
}
```

#### notes
- how do you handle slightly different urls from shares?
  - map shares to a post based on url matching
