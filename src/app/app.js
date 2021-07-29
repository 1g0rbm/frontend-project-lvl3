import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import parseRss from './parseRss.js';

export default () => {
  const initialState = {
    state: 'clean',
    input: null,
    sources: [],
    feeds: [],
    posts: [],
    errors: [],
  };

  window.addEventListener('DOMContentLoaded', () => {
    const view = {
      app: document.getElementById('app'),
      form: document.getElementById('rssForm'),
      input: document.getElementById('rssSource'),
      submitBtn: document.querySelector('[type="submit"]'),
      posts: document.getElementById('rssPosts'),
      feeds: document.getElementById('rssFeeds'),
    };

    const renderFeeds = ({ input, feeds }) => {
      view.feeds.innerHTML = '';
      if (feeds.length === 0) {
        return;
      }

      const head = document.createElement('h2');
      head.textContent = 'Feeds';
      const ul = document.createElement('ul');
      ul.className = 'list-group border-0 rounded-0';

      feeds.forEach((feed) => {
        const h3 = document.createElement('h3');
        h3.className = 'h6 m-0';
        h3.textContent = feed.title;

        const p = document.createElement('p');
        p.className = 'm-0 small text-black-50';
        p.textContent = feed.description;

        const li = document.createElement('li');
        li.className = 'list-group-item border-0 border-end-0';
        li.append(h3);
        li.append(p);

        ul.append(li);
      });

      view.feeds.append(head);
      view.feeds.append(ul);
      view.submitBtn.disabled = false;
      view.input.value = input;
    };

    const renderError = ({ errors }) => {
      view.submitBtn.disabled = false;
      view.input.classList.remove('is-invalid');
      view.app.querySelectorAll('p.feedback.text-danger')
        .forEach((p) => p.remove());

      if (errors.length > 0) {
        view.input.classList.add('is-invalid');
        errors.forEach((error) => {
          const p = document.createElement('p');
          p.classList = 'feedback m-0 small text-danger';
          p.textContent = error;
          view.form.closest('.row').append(p);
        });
      }
    };

    const watchedState = onChange(initialState, () => {
      switch (watchedState.state) {
        case 'pending':
          view.submitBtn.disabled = true;
          break;
        case 'invalid':
          renderError(watchedState);
          break;
        case 'show':
          renderFeeds(watchedState);
          renderError(watchedState);
          break;
        case 'clean':
        default:
      }
    });

    view.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.state = 'pending';
      watchedState.input = view.input.value;

      const schema = yup.string().url().notOneOf(watchedState.sources);
      schema.validate(view.input.value)
        .then((url) => axios.get(url))
        .then((response) => parseRss(response.data))
        .then(({
          id,
          title,
          description,
          posts,
        }) => {
          watchedState.errors = [];
          watchedState.feeds.push({ id, title, description });
          watchedState.posts = [...watchedState.posts, ...posts];
          watchedState.input = null;
          watchedState.state = 'show';
        })
        .catch((err) => {
          console.log('ERR: ', err.errors);
          watchedState.errors = err.errors;
          watchedState.state = 'invalid';
        });
    });
  });

  console.log('application is started...');
};
