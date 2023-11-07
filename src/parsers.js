import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const parseFile = (file) => {
  const pathFile = path.extname(file);
  if (pathFile === '.json') {
    return JSON.parse(fs.readFileSync(path.resolve(file)));
  }
  if (pathFile === '.yml' || pathFile === '.yaml') {
    return yaml.load(fs.readFileSync(path.resolve(file)));
  }

  return file;
};

export default parseFile;
