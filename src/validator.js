import * as yup from 'yup';

export const setCustomLocale = (locale) => {
  yup.setLocale(locale);
};

const throwValidationError = (msg) => {
  const error = new Error(msg);
  error.isValidationError = true;
  throw error;
};

export const validateUrl = (url, existedUrls) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(existedUrls);

  return schema.validate(url).catch((err) => throwValidationError(err.message));
};
