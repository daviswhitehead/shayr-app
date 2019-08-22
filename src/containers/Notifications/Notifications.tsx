import { Notification, User } from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { Query } from 'react-native-firebase/firestore';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import List from '../../components/List';
import UserTextDate from '../../components/UserTextDate';
import { getQuery, queryTypes } from '../../lib/FirebaseQueries';
import { selectAuthUserId } from '../../redux/auth/selectors';
import { selectFlatListReadyDocuments } from '../../redux/documents/selectors';
import { generateListKey } from '../../redux/lists/helpers';
import { selectListItems, selectListMeta } from '../../redux/lists/selectors';
import { loadNotifications } from '../../redux/notifications/actions';
import {
  selectAllUsers,
  selectUserFromId,
  selectUsersFromList
} from '../../redux/users/selectors';
import colors from '../../styles/Colors';
import styles from './styles';

const RENDER_COUNT = 0;

interface StateProps {
  authUser?: User;
  authUserId: string;
  authFriends?: {
    [userId: string]: User;
  };
  notificationsData: Array<Notification>;
  notificationsListKey: string;
  notificationsMeta: {
    [ids: string]: any; // TODO: list meta type
  };
  notificationsQuery: Query;
  users?: {
    [userId: string]: User;
  };
}

interface DispatchProps {
  loadNotifications: typeof loadNotifications;
}

interface OwnProps {}

interface OwnState {
  isLoading: boolean;
  didView: Array<string>;
}

interface NavigationParams {}

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationScreenProps<NavigationParams>;

const SAMPLE = {
  fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
  isRead: false,
  updatedAt: '2019-08-05T19:05:25.509Z',
  message: {
    android: {
      priority: 'high'
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          alert: {
            body:
              'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
            title: 'New shayr from Bob S'
          }
        }
      },
      headers: {
        apnspriority: '10'
      }
    },
    data: {
      channelId: 'General',
      title: 'New shayr from Bob S',
      body:
        'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
      appLink:
        'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
    },
    token:
      'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
    notification: {
      body:
        'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
      title: 'New shayr from Bob S'
    }
  },
  isPressed: false,
  pressedAt: null,
  receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
  readAt: null,
  createdAt: '2019-08-05T19:05:25.509Z'
};

const SAMPLES = [
  {
    _id: '0',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: false,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: null,
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '1',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '2',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '3',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: false,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: null,
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '4',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '5',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '6',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: false,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: null,
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '7',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '8',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '9',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: false,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: null,
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '10',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '11',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '12',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: false,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: null,
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '13',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  },
  {
    _id: '14',
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    isRead: true,
    updatedAt: '2019-08-05T19:05:25.509Z',
    message: {
      android: {
        priority: 'high'
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
              title: 'New shayr from Bob S'
            }
          }
        },
        headers: {
          apnspriority: '10'
        }
      },
      data: {
        channelId: 'General',
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=5TqHobu4sRdlJQlbxrsO'
      },
      token:
        'drbw9yITvP8:APA91bG765Jse67z7IunwCmx-OI4PUZd4FPE2lZbyl4YsB_X09D8LGbc-r1rU_9SNmXy_gC1DKObG5tx-CYAv14-x57uSfrs903zcJj5hpwHhRjQFd9GQyctbPrEDYN29xYPdgQEpxr9',
      notification: {
        body:
          'Bob S wants you to check out "After House rejects ‘stupid’ impeachment, Trump fuels rally crowd chant of ‘send her back!’ at Omar"',
        title: 'New shayr from Bob S'
      }
    },
    isPressed: false,
    pressedAt: null,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    readAt: '2019-08-05T19:05:25.509Z',
    createdAt: '2019-08-05T19:05:25.509Z'
  }
];

const mapStateToProps = (state) => {
  const authUserId = selectAuthUserId(state);
  const authUser = selectUserFromId(state, authUserId, true);
  const authFriends = selectUsersFromList(state, `${authUserId}_Friends`, true);
  const notificationsListKey = generateListKey(
    authUserId,
    queryTypes.NOTIFICATIONS
  );

  return {
    authUserId,
    authUser,
    authFriends,
    notificationsData: selectFlatListReadyDocuments(
      state,
      'notifications',
      selectListItems(state, 'notificationsLists', notificationsListKey),
      notificationsListKey,
      'createdAt'
    ),
    notificationsListKey,
    notificationsMeta: selectListMeta(
      state,
      'notificationsLists',
      notificationsListKey
    ),
    notificationsQuery: getQuery(queryTypes.NOTIFICATIONS)(authUserId),
    users: selectAllUsers(state, true)
  };
};

const mapDispatchToProps = {
  loadNotifications
};

class Notifications extends Component<Props, OwnState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      didView: []
    };
  }

  componentDidMount() {
    this.checkLoading();
    this.props.loadNotifications(
      this.props.notificationsListKey,
      this.props.notificationsQuery
    );
  }

  componentDidUpdate(prevProps: Props) {
    this.checkLoading();
  }

  componentWillUnmount() {
    // TODO: mark notifications as read!
  }

  checkLoading = () => {
    if (
      this.state.isLoading &&
      this.props.authUser &&
      this.props.authFriends &&
      this.props.notificationsMeta &&
      this.props.notificationsMeta.isLoaded
    ) {
      this.setState({ isLoading: false });
    }
  };

  onNewItems = (info: any) => {
    if (this.state.isLoading) {
      return;
    }

    const notificationIds = _.reduce(
      info.changed,
      (result, value, key) => {
        if (value.isViewable) {
          result.push(value.item._id);
        }
        return result;
      },
      []
    );

    // prevent unnecessary setStates
    if (
      !_.isEqual(
        _.intersection(this.state.didView, notificationIds),
        notificationIds
      )
    ) {
      this.setState((previousState) => ({
        ...previousState,
        didView: _.uniq([...previousState.didView, ...notificationIds])
      }));
    }
  };

  onItemPress = (item: Notification) => {
    // TODO: mark notification as pressed
    Linking.openURL(item.message.data.appLink);
  };

  renderItem = ({ item }: { item: Notification }) => {
    const isNotification = !_.isEmpty(item.message);

    return (
      <View
        style={isNotification && !item.isRead ? styles.unreadNotification : {}}
      >
        <UserTextDate
          isLoading={this.state.isLoading}
          user={isNotification ? this.props.users[item.fromId] : undefined}
          text={isNotification ? item.message.notification.body : undefined}
          createdAt={isNotification ? item.createdAt.toDate() : undefined}
          isNotification={isNotification}
          onPressContainer={
            isNotification ? () => this.onItemPress(item) : undefined
          }
        />
      </View>
    );
  };

  paginateList = () => {
    if (!this.props.notificationsMeta) {
      return;
    }
    return this.props.loadNotifications(
      this.props.notificationsListKey,
      this.props.notificationsQuery,
      false,
      this.props.notificationsMeta.isLoading,
      this.props.notificationsMeta.lastItem
    );
  };

  refreshList = () => {
    if (!this.props.notificationsMeta) {
      return;
    }
    return this.props.loadNotifications(
      this.props.notificationsListKey,
      this.props.notificationsQuery,
      true,
      this.props.notificationsMeta.isLoading,
      this.props.notificationsMeta.lastItem
    );
  };

  render() {
    console.log(`Notifications - Render ${RENDER_COUNT}`);
    console.log('this.props');
    console.log(this.props);
    console.log('this.state');
    console.log(this.state);
    // RENDER_COUNT += 1;

    return (
      <View style={styles.screen}>
        <Header
          backgroundColor={colors.YELLOW}
          statusBarStyle='dark-content'
          shadow
          title='Notifications'
          back={() => this.props.navigation.goBack(null)}
        />
        <List
          data={this.props.notificationsData}
          renderItem={this.renderItem}
          onViewableItemsChanged={this.onNewItems}
          onEndReached={this.paginateList}
          onRefresh={this.refreshList}
          isLoading={this.state.isLoading}
          isRefreshing={
            this.state.isLoading
              ? false
              : this.props.notificationsMeta.isRefreshing
          }
          isPaginating={
            this.state.isLoading
              ? false
              : this.props.notificationsMeta.isLoading
          }
          isLoadedAll={
            this.state.isLoading
              ? false
              : this.props.notificationsMeta.isLoadedAll
          }
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {
    areStatePropsEqual: (next: any, prev: any) => {
      return _.isEqual(next, prev);
    }
  }
)(Notifications);
