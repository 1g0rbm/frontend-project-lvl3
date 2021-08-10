import axios from 'axios';
import http from 'axios/lib/adapters/http';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect, beforeEach } from '@jest/globals';
import { loadRss, loadNewPosts, proxyUrl } from '../src/loadRss';
import loadFileContent from './helpers/loadFileContent.js';

axios.defaults.adapter = http;

const filenamePath = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filenamePath);

let url;
beforeEach(() => {
  url = 'https://hexlet-allorigins.herokuapp.com/get?url=url&disableCache=true';
});

test('successfull rss loading', async () => {
  const rssFeedPath = join(dirnamePath, '..', '__fixtures__', 'valid_feed.rss');
  const rssFeed = loadFileContent(rssFeedPath);

  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=url&disableCache=true')
    .reply(200, { contents: rssFeed });

  await expect(loadRss(url)).resolves.toBe(rssFeed);
});

test('error rss loading', async () => {
  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=url&disableCache=true')
    .replyWithError('Enternal error');

  await expect(loadRss(url)).rejects.toThrowError('Enternal error');
});

test('load new posts', async () => {
  const rssFeedPath = join(dirnamePath, '..', '__fixtures__', 'valid_feed.rss');
  const rssFeed = loadFileContent(rssFeedPath);

  const statePath = join(dirnamePath, '..', '__fixtures__', 'filled_state.json');
  const state = JSON.parse(loadFileContent(statePath));

  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=https%3A%2F%2Ftest.com%2Fsources.rss&disableCache=true')
    .reply(200, { contents: rssFeed });

  await expect(loadNewPosts(state))
    .resolves
    .toEqual([{
      id: '1',
      feedId: '1',
      title: 'Post 3',
      description: 'Example description for post 3',
      link: 'https://test.com/example/post-3',
    }]);
});

test('proxy URL', () => {
  const proxiedUrl = 'http://url.test';

  expect(proxyUrl(proxiedUrl))
    .toBe('https://hexlet-allorigins.herokuapp.com/get?url=http%3A%2F%2Furl.test&disableCache=true');
});
