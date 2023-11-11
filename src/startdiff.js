import path from 'path';
import fs from 'fs';
import parse from './parsers.js';
import formatter from './formatters/index.js';
import buildDiffTree from './buildDiffTree.js';

const genDiff = (filepath1, filepath2, option) => {
  const absoluteFilepath1 = path.resolve(process.cwd(), filepath1);
  const absoluteFilepath2 = path.resolve(process.cwd(), filepath2);
  const ext1 = path.extname(filepath1);
  const ext2 = path.extname(filepath2);
  const data1 = fs.readFileSync(absoluteFilepath1, 'utf-8');
  const data2 = fs.readFileSync(absoluteFilepath2, 'utf-8');
  const obj1 = parse(data1, ext1);
  const obj2 = parse(data2, ext2);

  return formatter(buildDiffTree(obj1, obj2), option);
};

export default genDiff;
