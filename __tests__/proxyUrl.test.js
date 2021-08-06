import { test, expect } from '@jest/globals';
import proxyUrl from '../src/proxyUrl';

test('proxy URL', () => {
  const url = 'http://url.test';

  expect(proxyUrl(url).toString())
    .toBe('https://hexlet-allorigins.herokuapp.com/get?url=http%3A%2F%2Furl.test&disableCache=true');
});
