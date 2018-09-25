const admin = require('firebase-admin');
const URL = require('url');

exports.normalizeUrl = (url) => {
  const urlData = URL.parse(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};


exports.addTs = (payload) => {
  const ts = admin.firestore.FieldValue.serverTimestamp();

  return {
    ...payload,
    createdAt: ts,
    updatedAt: ts,
  }
}
