#!/usr/bin/env node

// import path from 'path';
// import fs from 'fs';
import { Command } from 'commander';
import genDiff from '../src/startdiff.js';

const program = new Command();

/* const genDiff = (file1, file2) => {
  const valueOfFile1 = Object.keys(file1).sort();
  const valueOfFile2 = Object.keys(file2).sort();
  let compares = valueOfFile1.reduce((acc, key) => {
    let newAcc = [];
    if (!valueOfFile2.includes(key)) {
      const nextValue = `  - ${key}: ${file1[key]}`;
      newAcc = [...acc, nextValue];
    } else if (file1[key] === file2[key]) {
      const nextValue = `    ${key}: ${file1[key]}`;
      newAcc = [...acc, nextValue];
      valueOfFile2.splice(valueOfFile2.indexOf(key), 1);
    } else {
      const nextValue1 = `  - ${key}: ${file1[key]}`;
      const nextValue2 = `  + ${key}: ${file2[key]}`;
      newAcc = [...acc, nextValue1, nextValue2];
      valueOfFile2.splice(valueOfFile2.indexOf(key), 1);
    }
    return newAcc;
  }, []);
  valueOfFile2.forEach((key) => {
    const nextValue = `  + ${key}: ${file2[key]}`;
    compares = [...compares, nextValue];
  });

  return (`{\n${compares.join('\n')}\n}`);
}; */

program
  .name('gendiff')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format')
  .action((file1, file2) => {
    // const comparedFile1 = (fs.readFileSync(path.resolve(file1)));
    // const comparedFile2 = JSON.parse(fs.readFileSync(path.resolve(file2)));
    // console.log('1 - ', comparedFile1);
    // console.log('2 - ', comparedFile2);
    const diff = genDiff(file1, file2);
    console.log(diff);
  });

program.parse(process.argv);

const options = program.opts();
if (options.version) console.log(options.version);

// export default genDiff;
