const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit-logo')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  require('metascraper-readability')(),
  require('metascraper-audio')(),
  require('metascraper-soundcloud')(),
  require('metascraper-video')(),
  require('metascraper-youtube')(),
]);
const got = require('got');
const Mercury = require('@postlight/mercury-parser');

export const scrape = async (targetUrl: string) => {
  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });
  let medium;
  if (metadata.video || (metadata.publisher && metadata.publisher.toLowerCase() === 'youtube')) {
    medium = 'video';
  } else if (metadata.audio) {
    medium = 'audio';
  } else {
    medium = 'text';
  }

  const wordCount = await Mercury.parse(url, { html }).then((result: any) => result.word_count);

  return {
    description: metadata.description,
    image: metadata.image,
    medium,
    publisher: {
      logo: metadata.logo,
      name: metadata.publisher,
    },
    title: metadata.title,
    url: metadata.url,
    wordCountEstimate: wordCount,
  };
};
