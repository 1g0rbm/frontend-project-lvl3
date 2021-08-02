import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect, beforeAll } from '@jest/globals';
import parseRss from '../src/parseRss.js';
import loadFileContent from './helpers/loadFileContent.js';

const filenamePath = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filenamePath);

let validFeed = null;
let invalidFeed = null;
let ast = null;
beforeAll(() => {
  const rssValidFeedPath = join(dirnamePath, '..', '__fixtures__', 'valid_feed.rss');
  validFeed = loadFileContent(rssValidFeedPath);

  const rssAstPath = join(dirnamePath, '..', '__fixtures__', 'valid_feed_ast.json');
  ast = JSON.parse(loadFileContent(rssAstPath));

  const rssInvalidFeedPath = join(dirnamePath, '..', '__fixtures__', 'invalid_feed.rss');
  invalidFeed = loadFileContent(rssInvalidFeedPath);
});

test('parsing valid rss feed', () => {
  expect(parseRss(validFeed)).toEqual(ast);
});

test('parsing valid rss feed with existed feedId', () => {
  expect(parseRss(validFeed, 'feed_101').id).toEqual('feed_101');
});

test('parsing invalid rss feed', () => {
  expect(() => parseRss(invalidFeed)).toThrowError('errors.invalid_rss');
});
