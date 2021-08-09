const ALL_ORIGINS = 'https://hexlet-allorigins.herokuapp.com/get';

export default (url) => {
  const proxiedUrl = new URL(ALL_ORIGINS);
  proxiedUrl.searchParams.append('url', url);
  proxiedUrl.searchParams.append('disableCache', true);

  return proxiedUrl.toString();
};
