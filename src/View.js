import i18n from 'i18next';
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
};

export default class View {
  constructor() {
    this.app = document.getElementById('app');
    this.form = document.getElementById('rssForm');
    this.input = document.getElementById('rssSource');
    this.submitBtn = document.querySelector('[type="submit"]');
    this.posts = document.getElementById('rssPosts');
    this.feeds = document.getElementById('rssFeeds');
    this.modal = document.getElementById('modal');
  }

  disableForm() {
    this.submitBtn.disabled = true;
    this.input.setAttribute('readonly', true);
  }

  cleanupFeedback() {
    this.input.classList.remove('is-invalid');
    this.input.removeAttribute('readonly');
    this.app.querySelectorAll('p.feedback')
      .forEach((p) => p.remove());
  }

  enableForm({ input }) {
    this.input.value = input;
    this.input.focus();
    this.submitBtn.disabled = false;
  }

  renderModal({ currentPostId, posts }) {
    const post = _.find(posts, { id: currentPostId });

    if (!post) {
      return;
    }

    this.modal.querySelector('.modal-title').textContent = post.title;
    this.modal.querySelector('.modal-body').innerHTML = post.description;
    this.modal.querySelector('.go-to-article').href = post.link;
  }

  renderPosts({ readPostsIds, posts }) {
    this.posts.innerHTML = '';
    if (posts.length === 0) {
      return;
    }

    const headCard = createHeadCard(i18n.t('posts'));
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
      btn.textContent = i18n.t('view');
      btn.dataset.postId = post.id;
      btn.dataset.bsToggle = 'modal';
      btn.dataset.bsTarget = '#modal';

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
      li.append(a);
      li.append(btn);

      ul.append(li);
    });

    this.posts.append(headCard);
    this.posts.append(ul);
  }

  renderFeedback({ errors }) {
    const p = document.createElement('p');
    p.className = 'feedback m-0 small';

    if (errors.length > 0) {
      this.input.classList.add('is-invalid');
      errors.forEach((error) => {
        p.classList.add('text-danger');
        p.textContent = error;
      });
    } else {
      p.classList.add('text-success');
      p.textContent = i18n.t('feed_loaded');
    }

    this.form.closest('.row').append(p);
  }

  renderFeeds({ input, feeds }) {
    this.feeds.innerHTML = '';
    if (feeds.length === 0) {
      return;
    }

    const headCard = createHeadCard(i18n.t('feeds'));
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

    this.feeds.append(headCard);
    this.feeds.append(ul);
    this.submitBtn.disabled = false;
    this.input.value = input;
  }
}
