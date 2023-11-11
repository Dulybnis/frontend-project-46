import _ from 'lodash';

const buildDiffTree = (obj1, obj2) => {
  const valueObj1 = Object.keys(obj1);
  const valueObj2 = Object.keys(obj2);
  const keys = _.sortBy(_.union(valueObj1, valueObj2));

  const treePart = keys.flatMap((key) => {
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return {
        key,
        status: 'nested',
        children: buildDiffTree(obj1[key], obj2[key]),
      };
    }
    if (!valueObj1.includes(key)) {
      return (_.isObject(obj2[key]))
        ? {
          key,
          status: 'added',
          children: buildDiffTree(obj2[key], obj2[key]),
        }
        : {
          key,
          status: 'added',
          value: obj2[key],
        };
    }
    if (!valueObj2.includes(key)) {
      return (_.isObject(obj1[key]))
        ? {
          key,
          status: 'removed',
          children: buildDiffTree(obj1[key], obj1[key]),
        }
        : {
          key,
          status: 'removed',
          value: obj1[key],
        };
    }
    if (obj1[key] !== obj2[key]) {
      const updatedFrom = (_.isObject(obj1[key]))
        ? {
          key,
          status: 'updatedFrom',
          children: buildDiffTree(obj1[key], obj1[key]),
        }
        : {
          key,
          status: 'updatedFrom',
          value: obj1[key],
        };
      const updatedTo = (_.isObject(obj2[key]))
        ? {
          key,
          status: 'updatedTo',
          children: buildDiffTree(obj2[key], obj2[key]),
        }
        : {
          key,
          status: 'updatedTo',
          value: obj2[key],
        };
      return [updatedFrom, updatedTo];
    }
    if (obj1[key] === obj2[key]) {
      return {
        key,
        status: 'nested',
        value: obj1[key],
      };
    }
    throw new Error(`Invalid data - ${obj1[key]} or ${obj2[key]}`);
  });
  return treePart;
};

export default buildDiffTree;
