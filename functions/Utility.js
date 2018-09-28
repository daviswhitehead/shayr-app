const config = require('./Config');
const URL = require('url');
const ts = config.admin.firestore.FieldValue.serverTimestamp();

exports.normalizeUrl = (url) => {
  const urlData = URL.parse(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};


exports.addCreatedAt = (payload) => {
  return {
    ...payload,
    createdAt: ts,
  }
}

exports.addUpdatedAt = (payload) => {
  return {
    ...payload,
    updatedAt: ts,
  }
}
