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

test('run timer test', () => {
  let counter = 0;
  const timer = new Timer(() => {
    counter += 1;
  }, 1000);

  timer.start();
  jest.runOnlyPendingTimers();
  expect(counter).toBe(1);
});

test('run and stop timer test', () => {
  let counter = 0;
  const timer = new Timer(() => {
    counter += 1;
  }, 1000);

  timer.start();
  jest.runOnlyPendingTimers();
  expect(counter).toBe(1);

  timer.stop();
  jest.runOnlyPendingTimers();
  expect(counter).toBe(1);
});
