import _ from 'lodash';
import loadRss from './loadRss.js';
import parseRss from './parseRss.js';

export default (state) => Promise.all(state.feeds.map((feed) => loadRss(feed.source)
  .then((data) => parseRss(data))
  .then((parsed) => {
    const statePostsTitles = state.posts
      .filter((post) => post.feedId === feed.id)
      .map((post) => post.title);

    return parsed.posts
      .filter((post) => !statePostsTitles.includes(post.title))
      .map((post) => ({ ...post, feedId: feed.id, id: _.uniqueId() }));
  })))
  .then((data) => _.flatten(data));
