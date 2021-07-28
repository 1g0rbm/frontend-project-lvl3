import _ from 'lodash';

const parser = new DOMParser();

export default (rssXml) => {
  const doc = parser.parseFromString(rssXml, 'application/xml');

  const feedId = _.uniqueId('feed_');

  return {
    id: feedId,
    title: doc.querySelector('title').textContent.trim(),
    description: doc.querySelector('title').textContent.trim(),
    posts: _.map(doc.querySelectorAll('channel item'), (item) => ({
      id: `${feedId}.${_.uniqueId('post_')}`,
      title: item.querySelector('title').textContent.trim(),
      description: item.querySelector('description').textContent.trim(),
      link: item.querySelector('link')?.textContent.trim(),
    })),
  };
};
