import _ from 'lodash';

const createHeadCard = (title) => {
  const head = document.createElement('h2');
  head.className = 'card-title h4';
  head.textContent = title;
  const headCardBody = document.createElement('div');
  headCardBody.className = 'card-body';
  headCardBody.append(head);
  const headCard = document.createElement('div');
  headCard.className = 'card border-0';
  headCard.append(headCardBody);

  return headCard;
};

export default class View {
  constructor(elems, t) {
    this.elems = elems;
    this.i18n = t;
  }

  disableForm() {
    this.elems.submitBtn.disabled = true;
    this.elems.input.setAttribute('readonly', true);
  }

  cleanupFeedback() {
    this.elems.input.classList.remove('is-invalid');
    this.elems.feedback.classList.remove('text-success');
    this.elems.feedback.classList.remove('text-danger');
    this.elems.input.removeAttribute('readonly');
    this.elems.feedback.textContent = '';
  }

  enableForm({ input }) {
    this.elems.input.value = input;
    this.elems.input.focus();
    this.elems.submitBtn.disabled = false;
  }

  renderModal({ currentPostId, posts }) {
    const post = _.find(posts, { id: currentPostId });

    if (!post) {
      return;
    }

    this.elems.modal.querySelector('.modal-title').textContent = post.title;
    this.elems.modal.querySelector('.modal-body').innerHTML = post.description;
    this.elems.modal.querySelector('.go-to-article').href = post.link;
  }

  renderPosts({ readPostsIds, posts }) {
    this.elems.posts.innerHTML = '';
    if (posts.length === 0) {
      return;
    }

    const headCard = createHeadCard(this.i18n('posts'));
    const ul = document.createElement('ul');
    ul.className = 'list-group border-0 rounded-0';

    posts.forEach((post) => {
      const a = document.createElement('a');
      a.href = post.link;
      a.textContent = post.title;
      a.className = readPostsIds.includes(post.id) ? 'fw-normal' : 'fw-bold';
      a.target = '_blank';
      a.dataset.postId = post.id;

      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-primary btn-sm';
      btn.textContent = this.i18n('view');
      btn.dataset.postId = post.id;
      btn.dataset.bsToggle = 'modal';
      btn.dataset.bsTarget = '#modal';

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
      li.append(a);
      li.append(btn);

      ul.append(li);
    });

    this.elems.posts.append(headCard);
    this.elems.posts.append(ul);
  }

  renderFeedback({ errors }) {
    if (errors.length > 0) {
      this.elems.input.classList.add('is-invalid');
      this.elems.feedback.classList.add('text-danger');
      errors.forEach((error) => {
        this.elems.feedback.textContent = this.i18n(error);
      });
    } else {
      this.elems.feedback.classList.add('text-success');
      this.elems.feedback.textContent = this.i18n('feed_loaded');
    }
  }

  renderFeeds({ input, feeds }) {
    this.elems.feeds.innerHTML = '';
    if (feeds.length === 0) {
      return;
    }

    const headCard = createHeadCard(this.i18n('feeds'));
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

    this.elems.feeds.append(headCard);
    this.elems.feeds.append(ul);
    this.elems.submitBtn.disabled = false;
    this.elems.input.value = input;
  }
}
