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
ATOMS
shares/{share} {
  createdAt (timestamp),
  post (reference),
  tags [
    {tag} (reference),
    {tag} (reference)
  ],
  updatedAt (timestamp),
  user (reference),
  visible (boolean)
}

adds/{add} {
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  user (reference),
  visible (boolean)
}

dones/{done} {
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  user (reference),
  visible (boolean)
}

likes/{like} {
  createdAt (timestamp),
  post (reference),
  updatedAt (timestamp),
  user (reference),
  visible (boolean)
}
----

users/{user} {
  createdAt (timestamp),
  email (string),
  firstName (string),
  friends [
    {user} (reference),
    {user} (reference)
  ],
  lastName (string),
  tags [
    {tag} (reference),
    {tag} (reference)
  ]
  updatedAt (timestamp)

  shares/{share} {
    createdAt (timestamp),
    post (reference),
    tags [
      {tag} (reference),
      {tag} (reference)
    ],
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }

  adds/{add} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }

  dones/{done} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }

  likes/{like} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
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
  tags [
    {tag} (reference),
    {tag} (reference)
  ]
  title (string),
  updatedAt (timestamp),
  url (string)

  shares/{share} {
    createdAt (timestamp),
    post (reference),
    tags [
      {tag} (reference),
      {tag} (reference)
    ],
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }

  adds/{add} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }

  dones/{done} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }

  likes/{like} {
    createdAt (timestamp),
    post (reference),
    updatedAt (timestamp),
    user (reference),
    visible (boolean)
  }
}
```

#### notes
- how do you handle slightly different urls from shares?
  - map shares to a post based on url matching
