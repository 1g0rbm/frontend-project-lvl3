import axios from 'axios';
import _ from 'lodash';
import parseRss from './parseRss.js';

export const proxyUrl = (url) => {
  const ALL_ORIGINS = 'https://hexlet-allorigins.herokuapp.com/get';

  const proxiedUrl = new URL(ALL_ORIGINS);
  proxiedUrl.searchParams.append('url', url);
  proxiedUrl.searchParams.append('disableCache', true);

  return proxiedUrl.toString();
};

export const loadRss = (url) => (
  new Promise((resolve, reject) => {
    axios.get(url.toString())
      .then((response) => resolve(response.data.contents))
      .catch((err) => reject(err));
  })
);

export const loadNewPosts = (state) => (
  Promise.all(state.feeds.map((feed) => loadRss(proxyUrl(feed.source))
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
    .then((data) => _.flatten(data))
);
