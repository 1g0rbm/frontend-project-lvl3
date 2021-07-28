import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import parseRss from './parseRss.js';

export default () => {
  const state = {
    state: 'clean',
    sources: [],
    feeds: [],
    errors: [],
  };

  const showError = (view, { errors }) => {
    view.input.classList.add('is-invalid');

    errors.forEach((error) => {
      const p = document.createElement('p');
      p.classList = 'feedback text-danger';
      p.textContent = error;
      view.form.closest('.row').append(p);
    });
  };

  window.addEventListener('DOMContentLoaded', () => {
    const view = {
      app: document.getElementById('app'),
      form: document.getElementById('rssForm'),
      input: document.getElementById('rssSource'),
      submitBtn: document.querySelector('[type="submit"]'),
    };

    const watchedState = onChange(state, () => {
      switch (watchedState.state) {
        case 'pending':
          view.submitBtn.disabled = true;
          break;
        case 'invalid':
          showError(view, state);
          break;
        case 'clean':
        default:
      }
    });

    view.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.state = 'pending';

      const schema = yup.string().url().notOneOf(watchedState.sources);
      schema.validate(view.input.value)
        .then((url) => axios.get(url))
        .then((response) => {
          parseRss(response.data);
        })
        .catch((err) => {
          console.log('ERR: ', err);
          watchedState.errors = err.errors;
          watchedState.state = 'invalid';
        });
    });

    console.log('loaded', view);
  });

  console.log('application is started...');
};
