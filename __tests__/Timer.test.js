import { test, expect, jest } from '@jest/globals';
import Timer from '../src/Timer';

jest.useFakeTimers();

test('create timer', () => {
  let counter = 0;
  const timer = new Timer(() => {
    counter += 1;
  }, 1000);

  jest.runOnlyPendingTimers();

  expect(timer).toBeInstanceOf(Timer);
  expect(counter).toBe(0);
});

test('start timer test', () => (
  new Promise((resolve) => {
    const counter = 0;
    const timer = new Timer(() => {
      resolve(counter + 1);
    }, 1000);

    timer.start();
    jest.runOnlyPendingTimers();
  })
    .then((data) => expect(data).toBe(1))
));
