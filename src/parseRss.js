import _ from 'lodash';

const parser = new DOMParser();

export default (rssXml) => {
  const doc = parser.parseFromString(rssXml, 'application/xml');

  const err = doc.querySelector('parsererror');
  if (err) {
    throw new Error('errors.invalid_rss');
  }

  if (doc.firstChild.tagName !== 'rss') {
    throw new Error('errors.invalid_rss');
  }

  const title = doc.querySelector('title');
  const description = doc.querySelector('description');
  const link = doc.querySelector('link');
  const posts = doc.querySelectorAll('channel item');

  return {
    title: title.textContent.trim(),
    description: description.textContent.trim(),
    link: link?.textContent.trim(),
    posts: _.map(posts, (post) => {
      const postTitle = post.querySelector('title');
      const postDescription = post.querySelector('description');
      const postLink = post.querySelector('link');

      return {
        title: postTitle.textContent.trim(),
        description: postDescription.textContent.trim(),
        link: postLink?.textContent.trim(),
      };
    }),
  };
};
