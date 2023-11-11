const diffIdent = ' ';

const endDeep = (deep) => {
  const endIdent = diffIdent.repeat(deep * 4);
  return `${endIdent}}`;
};

const nextValue = (deep, key, sumbol, value = '{') => {
  const indent = diffIdent.repeat(deep * 4 - 2);
  return `${indent}${sumbol} ${key}: ${value}`;
};

const style = (nodes, deep = 1) => {
  const step = (nodeStep, deepStep, symbol) => {
    const stepOut = (nodeStep.children)
      ? [
        nextValue(deepStep, nodeStep.key, symbol),
        style(nodeStep.children, deep + 1),
        endDeep(deepStep),
      ].flat()
      : [nextValue(deepStep, nodeStep.key, symbol, nodeStep.value)].flat();
    return stepOut;
  };

  const styleOut = nodes.flatMap((node) => {
    if (node.status === 'added' || node.status === 'updatedTo') {
      return step(node, deep, '+');
    }
    if (node.status === 'removed' || node.status === 'updatedFrom') {
      return step(node, deep, '-');
    }
    if (node.status === 'nested') {
      return step(node, deep, ' ');
    }
    throw new Error(`Invalid data - ${node}`);
  });
  return styleOut;
};

const stylish = (data) => ['{', ...style(data), '}'].join('\n');

export default stylish;
