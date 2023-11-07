const constructor = (node) => {
  const valueNode = (node.meta.type === 'updated') ? node.value.value : node.value;
  const childrenNode = (node.meta.type === 'updated') ? node.value.children : node.children;
  const textValue = (typeof valueNode === 'string') ? `'${valueNode}'` : valueNode;
  const value = childrenNode ? '[complex value]' : textValue;

  return value;
};

const plain = (nodes) => {
  const plainOutput = nodes.reduce((acc, node) => {
    const property = [...node.meta.parent, node.name].join('.');
    if (node.meta.type === 'added') {
      const value = constructor(node);
      return [...acc, `Property '${property}' was added with value: ${value}`].flat();
    }
    if (node.meta.type === 'removed') {
      return [...acc, `Property '${property}' was removed`].flat();
    }
    if (node.meta.type === 'updated') {
      const from = constructor(node.meta.updatedFrom);
      const to = constructor(node);
      return [...acc, `Property '${property}' was updated. From ${from} to ${to}`].flat();
    }
    if (node.meta.type === 'not updated' && node.children) {
      return [...acc, plain(node.children)].flat();
    }
    return acc;
  }, []);

  return plainOutput.join('\n');
};

export default plain;
