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

exports.validateDate = (value) => {
  const timestamp = Date.parse(value);
  if (isNaN(timestamp) === false && timestamp > 0) {
    return true;
  } else {
    return false;
  }
};
