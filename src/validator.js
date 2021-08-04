import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notOneOf: 'errors.url_exist',
    required: 'errors.required',
  },
  string: {
    url: 'errors.url',
  },
});

export default (url, existedUrls) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(existedUrls);

  return schema.validate(url);
};
