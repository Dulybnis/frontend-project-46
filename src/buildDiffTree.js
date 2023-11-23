import _ from 'lodash';

const buildDiffTree = (obj1, obj2) => {
  const valueObj1 = Object.keys(obj1);
  const valueObj2 = Object.keys(obj2);
  const keys = _.sortBy(_.union(valueObj1, valueObj2));

  const valueOfObj = (obj) => {
    if (_.isObject(obj)) {
      return buildDiffTree(obj, obj);
    }
    return obj;
  };

  const treePart = keys.flatMap((key) => {
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return {
        key,
        status: 'nested',
        value: buildDiffTree(obj1[key], obj2[key]),
      };
    }
    if (!valueObj1.includes(key)) {
      return { key, value: valueOfObj(obj2[key]), status: 'added' };
    }
    if (!valueObj2.includes(key)) {
      return { key, value: valueOfObj(obj1[key]), status: 'removed' };
    }
    if (obj1[key] !== obj2[key]) {
      return {
        key, value: valueOfObj(obj2[key]), oldValue: valueOfObj(obj1[key]), status: 'changed',
      };
    }
    if (obj1[key] === obj2[key]) {
      return { key, value: obj1[key], status: 'unchanged' };
    }
    throw new Error(`Invalid data - ${obj1[key]} or ${obj2[key]}`);
  });
  return treePart;
};

export default buildDiffTree;
