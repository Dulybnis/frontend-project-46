import _ from 'lodash';

const complexValue = (val) => {
  if (_.isObject(val)) {
    return '[complex value]';
  }
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  return val;
};

const plain = (nodes, parent = []) => {
  const plainOutput = nodes.flatMap((node) => {
    const property = [...parent, node.key].join('.');

    switch (node.status) {
      case 'nested':
        return plain(node.value, [...parent, node.key]);

      case 'added':
        return `Property '${property}' was added with value: ${complexValue(node.value)}`;

      case 'unchanged':
        return 'not use';

      case 'removed':
        return `Property '${property}' was removed`;

      case 'changed':
        return `Property '${property}' was updated. From ${complexValue(node.oldValue)} to ${complexValue(node.value)}`;

      default:
        throw new Error(`Invalid data - ${node.status}`);
    }
  });

  return plainOutput.filter((key) => key !== 'not use').join('\n');
};

export default plain;
