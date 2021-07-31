import axios from 'axios';
import http from 'axios/lib/adapters/http';
import { test, expect } from '@jest/globals';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import loadNewPosts from '../src/loadNewPosts.js';
import createFakeState from './helpers/createFakeState.js';
import loadFileContent from './helpers/loadFileContent.js';

axios.defaults.adapter = http;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rssFeedPath = join(__dirname, '..', '__fixtures__', 'valid_feed.rss');
const rssFeed = loadFileContent(rssFeedPath);

test('load new posts', async () => {
  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=https%3A%2F%2Ftest.com%2Fsources.rss&disableCache=true')
    .reply(200, { contents: rssFeed });

  const state = createFakeState({
    feeds: [{
      id: 'feed_1',
      title: 'Test Feed',
      description: 'Feed for test',
      link: 'https://test.com/',
      source: 'https://test.com/sources.rss',
    }],
    posts: [
      {
        id: 'feed_1.post_1',
        feedId: 'feed_1',
        title: 'Post 1',
        description: 'Example description for post 1',
        link: 'https://test.com/example/post-1',
      },
      {
        id: 'feed_1.post_2',
        feedId: 'feed_1',
        title: 'Post 2',
        description: 'Example description for post 2',
        link: 'https://test.com/example/post-2',
      },
    ],
  });

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
