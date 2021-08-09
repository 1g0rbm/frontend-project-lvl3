import * as yup from 'yup';

export const setCustomLocale = (locale) => {
  yup.setLocale(locale);
};

export const validateUrl = (url, existedUrls) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(existedUrls);

  return schema.validate(url);
};
