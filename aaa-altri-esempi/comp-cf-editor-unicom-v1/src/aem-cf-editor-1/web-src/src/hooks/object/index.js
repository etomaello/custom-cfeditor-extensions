export const getArrayFromJsonByPath = (json, path) => {
  return path.split('.').reduce((data, key) => {
    return data && data[key] !== undefined ? data[key] : null;
  }, json);
};
