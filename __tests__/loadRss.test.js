import axios from 'axios';
import http from 'axios/lib/adapters/http';
import nock from 'nock';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect } from '@jest/globals';
import loadRss from '../src/loadRss';
import loadFileContent from './helpers/loadFileContent.js';

axios.defaults.adapter = http;

const filenamePath = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filenamePath);

test('successfull rss loading', async () => {
  const rssFeedPath = join(dirnamePath, '..', '__fixtures__', 'valid_feed.rss');
  const rssFeed = loadFileContent(rssFeedPath);

  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=url&disableCache=true')
    .reply(200, { contents: rssFeed });

  await expect(loadRss('url')).resolves.toBe(rssFeed);
});

test('error rss loading', async () => {
  nock('https://hexlet-allorigins.herokuapp.com')
    .get('/get?url=url&disableCache=true')
    .replyWithError('Enternal error');

  await expect(loadRss('url')).rejects.toThrowError('errors.internet');
});
