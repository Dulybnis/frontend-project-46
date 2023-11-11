const plain = (nodes, parent = []) => {
  const plainOutput = nodes.flatMap((node, index) => {
    const property = [...parent, node.key].join('.');
    const value = (typeof node.value === 'string') ? `'${node.value}'` : node.value;
    if (node.children && node.status === 'nested') {
      return plain(node.children, [...parent, node.key]);
    }
    if (node.status === 'added') {
      return (node.children)
        ? `Property '${property}' was added with value: [complex value]`
        : `Property '${property}' was added with value: ${value}`;
    }
    if (node.status === 'removed') {
      return `Property '${property}' was removed`;
    }
    if (node.status === 'updatedFrom') {
      const from = (node.children) ? '[complex value]' : value;
      const toNode = nodes[index + 1];
      const toValue = (typeof toNode.value === 'string') ? `'${toNode.value}'` : toNode.value;
      const to = (toNode.children) ? '[complex value]' : toValue;
      return `Property '${property}' was updated. From ${from} to ${to}`;
    }
    if (node.status === 'updatedTo' || node.status === 'nested') {
      return 'not use';
    }
    throw new Error(`Invalid data - ${node.status}`);
  });

  return plainOutput.filter((key) => key !== 'not use').join('\n');
};

export default plain;
