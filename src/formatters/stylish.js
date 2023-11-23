const diffIdent = ' ';

const buildEndIndent = (deep) => {
  const endIdent = diffIdent.repeat(deep * 4);
  return `${endIdent}}`;
};

const buildNextValue = (deep, key, sumbol, value = '{') => {
  const indent = diffIdent.repeat(deep * 4 - 2);
  return `${indent}${sumbol} ${key}: ${value}`;
};

const style = (nodes, deep = 1) => {
  const step = (nodeStep, deepStep, symbol) => {
    const stepOut = (Array.isArray(nodeStep.value))
      ? [
        buildNextValue(deepStep, nodeStep.key, symbol),
        style(nodeStep.value, deep + 1),
        buildEndIndent(deepStep),
      ].flat()
      : [buildNextValue(deepStep, nodeStep.key, symbol, nodeStep.value)].flat();
    return stepOut;
  };

  const styleOut = nodes.flatMap((node) => {
    switch (node.status) {
      case 'added':
        return step(node, deep, '+');

      case 'removed':
        return step(node, deep, '-');

      case 'nested':
      case 'unchanged':
        return step(node, deep, ' ');

      case 'changed':
        return [
          step({
            key: node.key,
            value: node.oldValue,
            status: node.status,
          }, deep, '-'),
          step(node, deep, '+'),
        ].flat();

      default:
        throw new Error(`Invalid data - ${node.status}`);
    }
  });
  return styleOut;
};

const stylish = (data) => ['{', ...style(data), '}'].join('\n');

export default stylish;
