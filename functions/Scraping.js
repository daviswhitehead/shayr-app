const ogs = require('open-graph-scraper');
const _ = require('lodash');

exports.scrape = (url) => {
  const options = {'url': url};
  return ogs(options)
    .then((result) => {
      if (result.success) {
        console.log('scraping success');
        return {
          title: _.get(result.data, 'ogTitle', '') || _.get(result.data, 'twitterTitle', ''),
          publisher: {
            name: _.get(result.data, 'ogSiteName', '') || _.get(result.data, 'twitterSite', ''),
            logo: ''
          },
          description: _.get(result.data, 'ogDescription', '') || _.get(result.data, 'twitterDescription', ''),
          image: _.get(result.data, 'ogImage.url', '') || _.get(result.data, 'twitterImage.url', ''),
          medium: _.get(result.data, 'ogType', '')
        }
      }
      else {
        console.log('scraping failure');
        return null
      }

    })
    .catch((error) => {
      console.log('error:', error);
      return null
    });
}
