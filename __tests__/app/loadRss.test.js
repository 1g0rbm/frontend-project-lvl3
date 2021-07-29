import axios from 'axios';
import http from 'axios/lib/adapters/http';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect } from '@jest/globals';
import loadRss from '../../src/app/loadRss';
import loadFileContent from '../helpers/loadFileContent.js';

axios.defaults.adapter = http;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('successfull rss loading', async () => {
  const rssFeedPath = join(__dirname, '..', '..', '__fixtures__', 'valid_feed.rss');
  const rssFeed = loadFileContent(rssFeedPath);

  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=url&disableCache=true')
    .reply(200, { contents: rssFeed });

  expect(await loadRss('url')).toBe(rssFeed);
});
