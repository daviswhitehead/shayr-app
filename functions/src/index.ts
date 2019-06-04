import * as functions from 'firebase-functions';
import { db } from './Config';
import { _onCreateInboundShare } from './InboundShare';
import {
  _onWriteAdd, _onWriteDone, _onWriteLike, _onWriteShare,
} from './PostActions';
import { _onWritePost } from './Post';

exports.onCreateInboundShare = functions.firestore
  .document('users/{userId}/inboundShares/{inboundShareId}')
  .onCreate((snap, context) => _onCreateInboundShare(db, snap, context));

exports.onWriteAdd = functions.firestore
  .document('adds/{addId}')
  .onWrite((change, context) => _onWriteAdd(db, change, context));

exports.onWriteDone = functions.firestore
  .document('dones/{doneId}')
  .onWrite((change, context) => _onWriteDone(db, change, context));

exports.onWriteLike = functions.firestore
  .document('likes/{likeId}')
  .onWrite((change, context) => _onWriteLike(db, change, context));

exports.onWritePost = functions.firestore
  .document('posts/{postId}')
  .onWrite((change, context) => _onWritePost(db, change, context));

exports.onWriteShare = functions.firestore
  .document('shares/{shareId}')
  .onWrite((change, context) => _onWriteShare(db, change, context));
