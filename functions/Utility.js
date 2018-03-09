const URL = require('url');

exports.normalizeUrl = (url) => {
  const urlData = URL.parse(url);

  return 'https://'.concat(
    urlData.hostname.replace(/^www\./,''),
    urlData.pathname
  )
};
