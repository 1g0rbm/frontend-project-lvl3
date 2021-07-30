export default class View {
  constructor() {
    this.app = document.getElementById('app');
    this.form = document.getElementById('rssForm');
    this.input = document.getElementById('rssSource');
    this.submitBtn = document.querySelector('[type="submit"]');
    this.posts = document.getElementById('rssPosts');
    this.feeds = document.getElementById('rssFeeds');
  }

  renderError({ errors }) {
    this.submitBtn.disabled = false;
    this.input.classList.remove('is-invalid');
    this.app.querySelectorAll('p.feedback.text-danger')
      .forEach((p) => p.remove());

    if (errors.length > 0) {
      this.input.classList.add('is-invalid');
      errors.forEach((error) => {
        const p = document.createElement('p');
        p.classList = 'feedback m-0 small text-danger';
        p.textContent = error;
        this.form.closest('.row').append(p);
      });
    }
  }

  renderFeeds({ input, feeds }) {
    this.feeds.innerHTML = '';
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

    this.feeds.append(head);
    this.feeds.append(ul);
    this.submitBtn.disabled = false;
    this.input.value = input;
  }
}
