import _ from 'lodash';

const parser = new DOMParser();

export default (rssXml, existedFeedId = null) => {
  const doc = parser.parseFromString(rssXml, 'application/xml');

  const err = doc.querySelector('parsererror');
  if (err) {
    throw new Error(err.textContent.trim());
  }

  const feedId = existedFeedId ?? _.uniqueId('feed_');

  return {
    id: feedId,
    title: doc.querySelector('title').textContent.trim(),
    description: doc.querySelector('description').textContent.trim(),
    link: doc.querySelector('link')?.textContent.trim(),
    posts: _.map(doc.querySelectorAll('channel item'), (item) => ({
      id: `${feedId}.${item.querySelector('title').textContent.trim().toLocaleLowerCase().replace(' ', '_')}`,
      feedId,
      title: item.querySelector('title').textContent.trim(),
      description: item.querySelector('description').textContent.trim(),
      link: item.querySelector('link')?.textContent.trim(),
    })),
  };
};
