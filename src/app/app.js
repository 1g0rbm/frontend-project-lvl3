import onChange from 'on-change';
import * as yup from 'yup';
import parseRss from './parseRss.js';
import loadRss from './loadRss.js';
import View from './View.js';

export default () => {
  const initialState = {
    state: 'clean',
    input: null,
    feeds: [],
    posts: [],
    errors: [],
  };

  const view = new View();

  window.addEventListener('DOMContentLoaded', () => {
    const watchedState = onChange(initialState, () => {
      switch (watchedState.state) {
        case 'pending':
          view.submitBtn.disabled = true;
          break;
        case 'invalid':
          view.renderError(watchedState);
          break;
        case 'show':
          view.renderFeeds(watchedState);
          view.renderError(watchedState);
          break;
        case 'clean':
        default:
      }
    });

    view.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.state = 'pending';
      watchedState.input = view.input.value;

      const schema = yup.string()
        .url()
        .notOneOf(watchedState.feeds.map((feed) => feed.source));
      schema.validate(watchedState.input)
        .then((url) => loadRss(url))
        .then((response) => parseRss(response))
        .then(({
          id, title, description, link, posts,
        }) => {
          watchedState.feeds.push({
            id, title, description, link, source: watchedState.input,
          });
          watchedState.posts = [...watchedState.posts, ...posts];
          watchedState.errors = [];
          watchedState.input = null;
          watchedState.state = 'show';
        })
        .catch((err) => {
          console.log('ERR: ', err);
          watchedState.errors = err.errors;
          watchedState.state = 'invalid';
        });
    });
  });
};
