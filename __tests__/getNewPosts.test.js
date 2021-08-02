import axios from 'axios';
import http from 'axios/lib/adapters/http';
import { test, expect, beforeAll } from '@jest/globals';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import loadNewPosts from '../src/loadNewPosts.js';
import loadFileContent from './helpers/loadFileContent.js';

axios.defaults.adapter = http;

const filenamePath = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filenamePath);

let rssFeed = null;
let state = null;
beforeAll(() => {
  const rssFeedPath = join(dirnamePath, '..', '__fixtures__', 'valid_feed.rss');
  rssFeed = loadFileContent(rssFeedPath);

  const statePath = join(dirnamePath, '..', '__fixtures__', 'filled_state.json');
  state = JSON.parse(loadFileContent(statePath));
});

test('load new posts', async () => {
  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=https%3A%2F%2Ftest.com%2Fsources.rss&disableCache=true')
    .reply(200, { contents: rssFeed });

  await expect(loadNewPosts(state))
    .resolves
    .toEqual([{
      id: 'feed_1.post_3',
      feedId: 'feed_1',
      title: 'Post 3',
      description: 'Example description for post 3',
      link: 'https://test.com/example/post-3',
    }]);
});
