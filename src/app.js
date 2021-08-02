import 'regenerator-runtime/runtime.js';
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import parseRss from './parseRss.js';
import loadRss from './loadRss.js';
import View from './View.js';
import resources from './locales/index.js';
import Timer from './Timer.js';
import loadNewPosts from './loadNewPosts.js';

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
    currentPostId: null,
    feeds: [],
    posts: [],
    readPostsIds: [],
    errors: [],
  };

  const view = new View();

  window.addEventListener('DOMContentLoaded', () => {
    const watchedState = onChange(initialState, () => {
      switch (watchedState.state) {
        case 'pending':
          view.disableForm();
          break;
        case 'invalid':
          view.cleanupFeedback();
          view.enableForm(watchedState);
          view.renderFeedback(watchedState);
          break;
        case 'show':
          view.cleanupFeedback();
          view.enableForm(watchedState);
          view.renderPosts(watchedState);
          view.renderFeeds(watchedState);
          view.renderFeedback(watchedState);
          break;
        case 'show-new-posts':
          view.renderModal(watchedState);
          view.renderPosts(watchedState);
          break;
        case 'clean':
        default:
          view.cleanupForm();
      }
    });

    const timer = new Timer(() => {
      loadNewPosts(watchedState)
        .then((newPosts) => {
          if (newPosts.length > 0) {
            watchedState.posts = [...watchedState.posts, ...newPosts];
            watchedState.state = 'show-new-posts';
          }
        });
    });

    view.posts.addEventListener('click', (e) => {
      const { target: { tagName, dataset: { postId } } } = e;
      if (tagName !== 'A' && tagName !== 'BUTTON') {
        return;
      }

      watchedState.readPostsIds.push(postId);
      watchedState.currentPostId = postId;
      watchedState.state = 'show-new-posts';
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
            title, description, link, id, source: watchedState.input,
          });
          watchedState.posts = [...watchedState.posts, ...posts];
          watchedState.errors = [];
          watchedState.input = null;
          watchedState.state = 'show';

          timer.start();
        })
        .catch((err) => {
          watchedState.errors = err.errors.map((error) => i18n.t(error)) ?? [i18n.t('errors.unknown')];
          watchedState.state = 'invalid';
        });
    });
  });
};
