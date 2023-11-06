import parseFile from './parsers.js';
import formatter from '../formatters/index.js';

const mkInternal = (nameInternal, children, deep, parent, type, updatedFrom) => ({
  name: nameInternal,
  children,
  meta: {
    deep,
    parent,
    type,
    updatedFrom,
  },
});

const mkLeaf = (nameLeaf, value, deep, parent, type, updatedFrom) => ({
  name: nameLeaf,
  value,
  meta: {
    deep,
    parent,
    type,
    updatedFrom,
  },
});

const isObject = (obj) => (typeof obj === 'object' && obj != null && !Array.isArray(obj));

const deepClone = (key, value, deep, parent, type) => {
  if (!isObject(value)) {
    return mkLeaf(key, value, deep, parent, type);
  }
  const valueKeys = Object.keys(value);
  const cloningValues = valueKeys.reduce((acc, cloningKey) => {
    if (!isObject(value[cloningKey])) {
      return [...acc, mkLeaf(cloningKey, value[cloningKey], deep + 1, [...parent, key], 'not update')];
    }
    return [...acc, deepClone(cloningKey, value[cloningKey], deep + 1, [...parent, key], 'not update')];
  }, []);
  return mkInternal(key, cloningValues, deep, parent, type);
};

const genDiff = (file1, file2, option) => {
  const parseFile1 = parseFile(file1);
  const parseFile2 = parseFile(file2);

  const genDeepDiff = (fileToDiff1, fileToDiff2, deep = 1, parent = []) => {
    const valueOfFile1 = Object.keys(fileToDiff1);
    const valueOfFile2 = Object.keys(fileToDiff2);
    const valueOfFile = [].concat(valueOfFile1, valueOfFile2)
      .reduce((acc, item) => ((acc.includes(item)) ? acc : [...acc, item]), [])
      .sort();

    const compares = valueOfFile.reduce((acc, key) => {
      const newParent = [...parent, key];
      let nextDeep;
      if (valueOfFile1.includes(key) && valueOfFile2.includes(key)) { // includes in two files
        if (isObject(fileToDiff1[key]) && isObject(fileToDiff2[key])) {
          const nextDeepDeef = genDeepDiff(fileToDiff1[key], fileToDiff2[key], deep + 1, newParent);
          nextDeep = mkInternal(key, nextDeepDeef, deep, parent, 'not updated', fileToDiff1[key]);
        } else if (fileToDiff1[key] === fileToDiff2[key]) {
          nextDeep = mkLeaf(key, fileToDiff1[key], deep, parent, 'not updated');
        } else {
          const updFrom = isObject(fileToDiff1[key])
            ? deepClone(key, fileToDiff1[key], deep, parent, 'not updated')
            : mkLeaf(key, fileToDiff1[key], deep, parent, 'not updated', fileToDiff2[key]);
          nextDeep = mkLeaf(key, fileToDiff2[key], deep, parent, 'updated', updFrom);
        }
      } else if (valueOfFile1.includes(key)) { // includes in first files
        nextDeep = deepClone(key, fileToDiff1[key], deep, parent, 'removed');
      } else { // includes in second files
        nextDeep = deepClone(key, fileToDiff2[key], deep, parent, 'added');
      }
      return [...acc, nextDeep];
    }, []);

    return (compares);
  };
  return formatter(genDeepDiff(parseFile1, parseFile2), option);
};

export default genDiff;
