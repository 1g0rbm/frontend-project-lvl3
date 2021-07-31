import _ from 'lodash';
import loadRss from './loadRss.js';
import parseRss from './parseRss.js';

export default (state) => Promise.all(state.feeds.map((feed) => loadRss(feed.source)
  .then((data) => parseRss(data, feed.id))
  .then((parsed) => {
    const statePosts = state.posts.filter((post) => post.feedId === feed.id);
    return _.differenceWith(parsed.posts, statePosts, _.isEqual);
  })))
  .then((data) => _.flatten(data));
