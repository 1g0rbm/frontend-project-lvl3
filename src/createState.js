import onChange from 'on-change';

export default (view) => {
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

  return state;
};
