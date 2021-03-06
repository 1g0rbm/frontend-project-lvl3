import 'regenerator-runtime/runtime.js';
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import parseRss from './parseRss.js';
import { loadRss, loadNewPosts, proxyUrl } from './loadRss.js';
import Timer from './Timer.js';
import View from './View.js';
import { setCustomLocale, validateUrl } from './validator.js';
import resources from './locales/index.js';

const app = () => {
  setCustomLocale({
    mixed: {
      notOneOf: 'errors.url_exist',
      required: 'errors.required',
    },
    string: {
      url: 'errors.url',
    },
  });

  const elems = {
    app: document.getElementById('app'),
    form: document.getElementById('rssForm'),
    input: document.getElementById('rssSource'),
    submitBtn: document.querySelector('[type="submit"]'),
    posts: document.getElementById('rssPosts'),
    feeds: document.getElementById('rssFeeds'),
    modal: document.getElementById('modal'),
    feedback: document.querySelector('.feedback'),
  };

  i18n.init({
    lng: 'ru',
    resources,
  })
    .then((t) => new View(elems, t))
    .then((view) => {
      const state = onChange(
        {
          state: 'clean',
          input: null,
          currentPostId: null,
          feeds: [],
          posts: [],
          readPostsIds: [],
          errors: [],
        },
        () => {
          switch (state.state) {
            case 'pending':
              view.disableForm();
              break;
            case 'invalid':
              view.cleanupFeedback();
              view.enableForm(state);
              view.renderFeedback(state);
              break;
            case 'show':
              view.cleanupFeedback();
              view.enableForm(state);
              view.renderPosts(state);
              view.renderFeeds(state);
              view.renderFeedback(state);
              break;
            case 'show-new-posts':
              view.renderModal(state);
              view.renderPosts(state);
              break;
            case 'clean':
            default:
              view.cleanupForm();
          }
        },
      );

      elems.posts.addEventListener('click', (e) => {
        const { target: { tagName, dataset: { postId } } } = e;
        if (tagName !== 'A' && tagName !== 'BUTTON') {
          return;
        }

        state.readPostsIds.push(postId);
        state.currentPostId = postId;
        state.state = 'show-new-posts';
      });

      const timer = new Timer(() => (
        loadNewPosts(state)
          .then((newPosts) => {
            if (newPosts.length > 0) {
              state.posts = [...newPosts, ...state.posts];
              state.state = 'show-new-posts';
            }
          })
      ));

      elems.form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.state = 'pending';
        state.input = elems.input.value;

        const existedUrls = state.feeds.map((feed) => feed.source);
        validateUrl(state.input, existedUrls)
          .then((url) => loadRss(proxyUrl(url)))
          .then((response) => parseRss(response))
          .then(({
            title, description, link, posts,
          }) => {
            const feedId = _.uniqueId();

            state.feeds.push({
              title, description, link, id: feedId, source: state.input,
            });
            state.posts = [
              ...posts.map((post) => ({ ...post, feedId, id: _.uniqueId() })),
              ...state.posts,
            ];
            state.errors = [];
            state.input = null;
            state.state = 'show';

            timer.start();
          })
          .catch((err) => {
            if (err.isAxiosError) {
              state.errors.push('errors.internet');
            } else if (err.isParsingError) {
              state.errors.push('errors.invalid_rss');
            } else if (err.isValidationError) {
              state.errors.push(err.message);
            } else {
              state.errors.push('errors.unknown');
            }

            state.state = 'invalid';
          });
      });
    });
};

export default app;
