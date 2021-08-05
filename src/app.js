import 'regenerator-runtime/runtime.js';
import _ from 'lodash';
import parseRss from './parseRss.js';
import loadRss from './loadRss.js';
import Timer from './Timer.js';
import loadNewPosts from './loadNewPosts.js';
import validator from './validator.js';
import createState from './createState.js';
import createView from './createView.js';

const app = () => {
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

  createView(elems)
    .then((view) => {
      const state = createState(view);

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

        validator(state.input, state.feeds.map((feed) => feed.source))
          .then((url) => loadRss(url))
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
            state.errors.push(err.message);
            state.state = 'invalid';
          });
      });
    });
};

export default app;
