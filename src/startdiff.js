import parseFile from './parsers.js';
import formatter from '../formatters/index.js';

const makeKnot = (nameInternal, value, deep, parent, type, updatedFrom) => {
  const knot = {
    name: nameInternal,
    meta: {
      deep,
      parent,
      type,
      updatedFrom,
    },
  };
  if (Array.isArray(value)) {
    knot.children = value;
    return knot;
  }
  knot.value = value;
  return knot;
};

const isObject = (obj) => (typeof obj === 'object' && obj != null && !Array.isArray(obj));

const deepClone = (key, value, deep, parent, type, updatedFrom) => {
  if (!isObject(value)) {
    return makeKnot(key, value, deep, parent, type, updatedFrom);
  }
  const valueKeys = Object.keys(value);
  const cloningValues = valueKeys.reduce((acc, cloningKey) => {
    if (typeof value[cloningKey] !== 'object' || value[cloningKey] === null) {
      return [...acc, makeKnot(cloningKey, value[cloningKey], deep + 1, [...parent, key], 'not updated', updatedFrom)];
    }
    return [...acc, deepClone(cloningKey, value[cloningKey], deep + 1, [...parent, key], 'not updated', updatedFrom)];
  }, []);
  return makeKnot(key, cloningValues, deep, parent, type, updatedFrom);
};

const genDiff = (file1, file2, option) => {
  const parseFile1 = parseFile(file1);
  const parseFile2 = parseFile(file2);

  const genDeepDiff = (fileToDiff1, fileToDiff2, deep = 1, parent = []) => {
    const valueOfFile1 = Object.keys(fileToDiff1);
    const valueOfFile2 = Object.keys(fileToDiff2);
    const valueOfFileUnsort = [].concat(valueOfFile1, valueOfFile2)
      .reduce((acc, item) => ((acc.includes(item)) ? acc : [...acc, item]), []);
    const valueOfFile = valueOfFileUnsort.sort();

    const compares = valueOfFile.reduce((acc, key) => {
      const newParent = [...parent, key];
      if (valueOfFile1.includes(key) && valueOfFile2.includes(key)) { // includes in two files
        if (isObject(fileToDiff1[key]) && isObject(fileToDiff2[key])) {
          const nextDeepDeef = genDeepDiff(fileToDiff1[key], fileToDiff2[key], deep + 1, newParent);
          const nextDeep = makeKnot(key, nextDeepDeef, deep, parent, 'not updated', fileToDiff1[key]);
          return [...acc, nextDeep];
        }
        if (fileToDiff1[key] === fileToDiff2[key]) {
          const nextDeep = makeKnot(key, fileToDiff1[key], deep, parent, 'not updated');
          return [...acc, nextDeep];
        }
        const updFrom = deepClone(key, fileToDiff1[key], deep, parent, 'not updated', fileToDiff2[key]);
        const updTo = deepClone(key, fileToDiff2[key], deep, parent, 'not updated', fileToDiff1[key]);
        const nextDeep = makeKnot(key, updTo, deep, parent, 'updated', updFrom);
        return [...acc, nextDeep];
      }
      const nextDeep = (valueOfFile1.includes(key))
        ? deepClone(key, fileToDiff1[key], deep, parent, 'removed')
        : deepClone(key, fileToDiff2[key], deep, parent, 'added');
      return [...acc, nextDeep];
    }, []);

    return (compares);
  };
  return formatter(genDeepDiff(parseFile1, parseFile2), option);
};

export default genDiff;
