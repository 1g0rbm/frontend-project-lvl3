import { test, expect, beforeAll } from '@jest/globals';
import { validateUrl, setCustomLocale } from '../src/validator';

let validUrl;
let invalidUrl;
let existedUrls;
beforeAll(() => {
  validUrl = 'http://test.com';
  invalidUrl = 'http:/test';
  existedUrls = [
    'https://first.com',
    'http://second.net',
  ];
});

test('should return url if it is valid', async () => {
  await expect(validateUrl(validUrl, existedUrls)).resolves.toBe(validUrl);
});

test('should return defualt message if url is invalid', async () => {
  await expect(validateUrl(invalidUrl, existedUrls)).rejects.toThrowError('this must be a valid URL');
});

test('should return defualt message if url is already exist', async () => {
  await expect(validateUrl(validUrl, [...existedUrls, validUrl]))
    .rejects
    .toThrowError(
      'this must not be one of the following values: https://first.com, http://second.net, http://test.com',
    );
});

test('should return custom message if there are custom locale and invalid url', async () => {
  setCustomLocale({
    mixed: {
      notOneOf: 'errors.url_exist',
    },
    string: {
      url: 'custom_invalid_url_error',
    },
  });
  await expect(validateUrl(invalidUrl, existedUrls)).rejects.toThrowError('custom_invalid_url_error');
});

test('should return custom message if there are custom locale and existed url', async () => {
  setCustomLocale({
    mixed: {
      notOneOf: 'custom_url_exist_error',
    },
  });
  await expect(validateUrl(validUrl, [...existedUrls, validUrl]))
    .rejects
    .toThrowError('custom_url_exist_error');
});
