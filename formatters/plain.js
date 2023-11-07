const constructor = (node) => {
  const valueNode = (node.meta.type === 'updated') ? node.value.value : node.value;
  const childrenNode = (node.meta.type === 'updated') ? node.value.children : node.children;
  const textValue = (typeof valueNode === 'string') ? `'${valueNode}'` : valueNode;
  const value = childrenNode ? '[complex value]' : textValue;

  return value;
};

const plain = (nodes) => {
  const plainOutput = nodes.reduce((acc, node) => {
    let newAcc = [];
    const property = [...node.meta.parent, node.name].join('.');
    if (node.meta.type === 'added') {
      const value = constructor(node);
      newAcc = `Property '${property}' was added with value: ${value}`;
    } else if (node.meta.type === 'removed') {
      newAcc = (`Property '${property}' was removed`);
    } else if (node.meta.type === 'updated') {
      const from = constructor(node.meta.updatedFrom);
      const to = constructor(node);
      newAcc = `Property '${property}' was updated. From ${from} to ${to}`;
    } else if (node.meta.type === 'not updated' && node.children) {
      newAcc = plain(node.children);
    }
    return [...acc, newAcc].flat();
  }, []);

  return plainOutput.join('\n');
};

export default plain;
