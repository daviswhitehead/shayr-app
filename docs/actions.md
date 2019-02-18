# Actions

## Global

## Authentication

### Sign Out

SIGN_OUT_START  
FACEBOOK_SIGN_OUT_START  
FACEBOOK_SIGN_OUT_SUCCESS  
APP_SIGN_OUT_START  
APP_SIGN_OUT_SUCCESS  
SIGN_OUT_SUCCESS  
SIGN_OUT_FAIL

### Token

ACCESS_TOKEN_SAVED

### Facebook Login

FACEBOOK_AUTH_TAP  
FACEBOOK_AUTH_START  
FACEBOOK_AUTH_SUCCESS  
FACEBOOK_CREDENTIAL_START  
FACEBOOK_CREDENTIAL_SUCCESS  
CURRENT_USER_START  
CURRENT_USER_SUCCESS  
SAVE_USER_START  
SAVE_USER_SUCCESS

### Notification Permissions

NOTIFICATION_PERMISSIONS_REQUEST_START  
NOTIFICATION_PERMISSIONS_REQUEST_SUCCESS  
NOTIFICATION_PERMISSIONS_REQUEST_FAIL

## Subscriptions

### Self

SUBSCRIBE_SELF_START  
SUBSCRIBE_SELF_SUCCESS  
SUBSCRIBE_SELF_FAIL

### Friendships

SUBSCRIBE_FRIENDSHIPS_START  
SUBSCRIBE_FRIENDSHIPS_SUCCESS  
SUBSCRIBE_FRIENDSHIPS_FAIL

### Friends

SUBSCRIBE_FRIENDS_START  
SUBSCRIBE_FRIENDS_SUCCESS  
SUBSCRIBE_FRIENDS_FAIL

### Notification Token

SUBSCRIBE_NOTIFICATION_TOKEN_START  
SUBSCRIBE_NOTIFICATION_TOKEN_SUCCESS  
SUBSCRIBE_NOTIFICATION_TOKEN_FAIL

## Post Details

POST_DETAIL_VIEW  
POST_DETAIL_BACK

## **Posts**

LOAD_POSTS_START  
LOAD_POSTS_SUCCESS  
LOAD_POSTS_FAIL  
PAGINATE_POSTS_START  
PAGINATE_POSTS_SUCCESS  
PAGINATE_POSTS_FAIL  
REFRESH  
LAST_POST

# Initial State

```javascript
{
    auth: {
        user: null,
        isAuthenticated: false,
        hasAccessToken: false,
        isSigningOut: false,
        listenersReady: false,,
        error: null,
    },
    users: {
        self: null,
        friendships: null,
        friends: null,
        error: null,
    }
    postDetails: {
        post: null,
        error: null,
    },
    posts: {
        feedPosts: null,
        queuePosts: null,
        feedLastPost: null,
        queueLastPost: null,
        feedRefreshing: false,
        queueRefreshing: false,
        error: null,
    }
}
```

# State Flow

Initialized upon app start (App & AppWithListeners)

- Redux Store
- Firebase Auth Listener
- Notifications
  - Channels
  - Listeners
- Navigator

Initialized upon succesful auth (AppWithListeners)
Trigger: (Sign in or Signing out)

- Self Listener
- Friends Listener
- Notification Token Listener

Initialized per screen (Feed, Queue)

- Feed Posts
- Queue Posts

Sign out flow

- SIGNOUT_START
- AUTH_LISTENERS_UNSUBSCRIBED
- FACEBOOK_SIGNOUT
- AUTH_SIGNOUT
