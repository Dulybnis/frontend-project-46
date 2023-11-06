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
      const constructor = children
        ? [
          nextValue(deep, name, symbol),
          styleArray([children].flat()),
          endDeep(deep),
        ].flat()
        : nextValue(deep, name, symbol, value);
      return constructor;
    };

    const output = nodes.reduce((acc, node) => {
      let newAcc = [];
      if (node.meta.type === 'updated') {
        newAcc = [
          diffConstructor(node.name, node.meta.deep, '-', node.meta.updatedFrom.value, node.meta.updatedFrom.children),
          diffConstructor(node.name, node.meta.deep, '+', node.value.value, node.children),
        ].flat();
      } else {
        let sumbol;
        switch (node.meta.type) {
          case 'not updated':
            sumbol = ' ';
            break;

          case 'removed':
            sumbol = '-';
            break;

          case 'added':
            sumbol = '+';
            break;

          default:
            sumbol = ' ';
        }
        newAcc = [diffConstructor(node.name, node.meta.deep, sumbol, node.value, node.children)]
          .flat();
      }
      return [...acc, newAcc].flat();
    }, []);

    return output;
  };

  const styleOutput = ['{', ...styleArray(nodesArray), '}'];
  return styleOutput.join('\n');
};

export default style;
