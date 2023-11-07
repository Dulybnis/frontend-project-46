const diffIdent = ' ';

const endDeep = (deep) => {
  const endIdent = diffIdent.repeat(deep * 4);
  return `${endIdent}}`;
};

const nextValue = (deep, key, sumbol, value = '{') => {
  const indent = diffIdent.repeat(deep * 4 - 2);
  return `${indent}${sumbol} ${key}: ${value}`;
};

const style = (nodesArray) => {
  const styleArray = (nodes) => {
    const diffConstructor = (name, deep, symbol, value, children) => {
      const constructor = (Array.isArray(children))
        ? [
          nextValue(deep, name, symbol),
          styleArray(children),
          endDeep(deep),
        ].flat()
        : nextValue(deep, name, symbol, value);
      return constructor;
    };

    const output = nodes.reduce((acc, node) => {
      if (node.meta.type === 'updated') {
        const updatedTo = (node.value) ? node.value : node.children;
        const updatedChildren = (updatedTo.value) ? updatedTo.value : updatedTo.children;
        const newAcc = [
          diffConstructor(node.name, node.meta.deep, '-', node.meta.updatedFrom.value, node.meta.updatedFrom.children),
          diffConstructor(node.name, node.meta.deep, '+', updatedTo.value, updatedChildren),
        ].flat();
        return [...acc, newAcc].flat();
      }
      if (node.meta.type === 'not updated') {
        const newAcc = diffConstructor(node.name, node.meta.deep, ' ', node.value, node.children);
        return [...acc, newAcc].flat();
      }
      if (node.meta.type === 'removed') {
        const newAcc = diffConstructor(node.name, node.meta.deep, '-', node.value, node.children);
        return [...acc, newAcc].flat();
      }
      if (node.meta.type === 'added') {
        const newAcc = diffConstructor(node.name, node.meta.deep, '+', node.value, node.children);
        return [...acc, newAcc].flat();
      }
      return acc;
    }, []);

    return output;
  };

  const styleOutput = ['{', ...styleArray(nodesArray), '}'];
  return styleOutput.join('\n');
};

export default style;
