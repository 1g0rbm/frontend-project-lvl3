import _ from 'lodash';
import loadRss from './loadRss.js';
import parseRss from './parseRss.js';
import proxyUrl from './proxyUrl.js';

export default (state) => Promise.all(state.feeds.map((feed) => loadRss(proxyUrl(feed.source))
  .then((data) => parseRss(data))
  .then((data) => {
    const newPosts = data.posts;
    const statePosts = state.posts;

    const postsDiff = _.differenceWith(
      newPosts,
      statePosts,
      (a, b) => a.title === b.title,
    );

    return postsDiff.map((post) => ({ ...post, feedId: feed.id, id: _.uniqueId() }));
  })))
  .then((data) => _.flatten(data));
