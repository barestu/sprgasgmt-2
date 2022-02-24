exports.extractBearerToken = (value) => {
  if (!value || !value.startsWith('Bearer ')) {
    return null;
  } else {
    return value.substring(7, value.length);
  }
};

exports.mapErrorsMessage = (errors) => {
  return errors.map((e) => e.message);
};
