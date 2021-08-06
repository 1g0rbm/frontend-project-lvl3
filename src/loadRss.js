import axios from 'axios';

export default (url) => (
  new Promise((resolve, reject) => {
    axios.get(url.toString())
      .then((response) => resolve(response.data.contents))
      .catch(() => reject(new Error('errors.internet')));
  })
);
