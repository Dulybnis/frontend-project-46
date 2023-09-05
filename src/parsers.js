import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const parseFile = (file) => {
  const pathFile = path.extname(file);
  let parseFileOut;
  if (pathFile === '.json') {
    parseFileOut = JSON.parse(fs.readFileSync(path.resolve(file)));
  }
  if (pathFile === '.yml' || pathFile === '.yaml') {
    parseFileOut = yaml.load(fs.readFileSync(path.resolve(file)));
  }

  return parseFileOut;
};

export default parseFile;
