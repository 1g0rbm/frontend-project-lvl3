import 'regenerator-runtime/runtime.js';
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import parseRss from './parseRss.js';
import loadRss from './loadRss.js';
import View from './View.js';
import resources from './locales/index.js';

export default async () => {
  await i18n.init({
    lng: 'ru',
    resources,
  });

  yup.setLocale({
    mixed: {
      notOneOf: i18n.t('errors.url_exist'),
      required: i18n.t('errors.required'),
    },
    string: {
      url: i18n.t('errors.url'),
    },
  });

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
          view.loadForm();
          break;
        case 'invalid':
          view.cleanupForm();
          view.renderFeedback(watchedState);
          break;
        case 'show':
          view.cleanupForm();
          view.renderPosts(watchedState);
          view.renderFeeds(watchedState);
          view.renderFeedback(watchedState);
          break;
        case 'clean':
        default:
          view.cleanupForm();
      }
    });

    view.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.state = 'pending';
      watchedState.input = view.input.value;

      const schema = yup.string()
        .required()
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
          watchedState.errors = err.errors ?? [i18n.t('errors.unknown')];
          watchedState.state = 'invalid';
        });
    });
  });
};