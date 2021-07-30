import axios from 'axios';

const ALL_ORIGINS = 'https://hexlet-allorigins.herokuapp.com/get';

export default (feedUrl) => {
  const url = new URL(ALL_ORIGINS);
  url.searchParams.append('url', feedUrl);
  url.searchParams.append('disableCache', true);

  return new Promise((resolve, reject) => {
    axios.get(url.toString())
      .then((response) => resolve(response.data.contents))
      .catch((err) => reject(err.message));
  });
};
