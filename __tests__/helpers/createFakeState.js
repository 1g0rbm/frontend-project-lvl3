export default (config = {}) => ({
  state: config.state || 'clean',
  input: config.input || null,
  feeds: config.feeds || [],
  posts: config.posts || [],
  errors: config.errors || [],
});
