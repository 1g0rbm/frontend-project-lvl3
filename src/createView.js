import i18n from 'i18next';
import resources from './locales/index.js';
import View from './View.js';

export default (elems) => (
  i18n.init({
    lng: 'ru',
    resources,
  })
    .then((t) => new View(elems, t))
);
