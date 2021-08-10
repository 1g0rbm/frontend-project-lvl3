export default class Timer {
  constructor(func, delay = 5000) {
    this.func = func;
    this.delay = delay;
    this.timeoutId = null;
  }

  start() {
    this.stop();

    this.timeoutId = setTimeout(
      () => Promise.resolve(this.func()).finally(() => this.start()),
      this.delay,
    );
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
