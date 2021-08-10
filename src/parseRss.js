import _ from 'lodash';

const parser = new DOMParser();

const throwParsingError = (msg) => {
  const error = new Error(msg);
  error.isParsingError = true;

  throw error;
};

export default (rssXml) => {
  const doc = parser.parseFromString(rssXml, 'application/xml');

  const err = doc.querySelector('parsererror');
  if (err) {
    throwParsingError(err.textContent);
  }

  if (doc.firstChild.tagName !== 'rss') {
    throw throwParsingError('There is no rss tag in content');
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
