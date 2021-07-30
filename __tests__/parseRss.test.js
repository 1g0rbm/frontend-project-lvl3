import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect } from '@jest/globals';
import parseRss from '../src/parseRss.js';
import loadFileContent from './helpers/loadFileContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('parsing valid rss feed', () => {
  const rssFeedPath = join(__dirname, '..', '__fixtures__', 'valid_feed.rss');
  const rssFeed = loadFileContent(rssFeedPath);
  const rssAstPath = join(__dirname, '..', '__fixtures__', 'valid_feed_ast.json');
  const rssAst = JSON.parse(loadFileContent(rssAstPath));

  expect(parseRss(rssFeed)).toEqual(rssAst);
});

test('parsing invalid rss feed', () => {
  const rssFeedPath = join(__dirname, '..', '__fixtures__', 'invalid_feed.rss');
  const rssFeed = loadFileContent(rssFeedPath);

  expect(() => parseRss(rssFeed)).toThrowError('4:5: disallowed character in attribu');
});
