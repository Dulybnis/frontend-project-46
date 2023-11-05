#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from '../src/startdiff.js';
import style from '../fixtures/stylish.js';

const program = new Command();

program
  .name('gendiff')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((file1, file2, options) => {
    // console.log(`format: ${options.format}`);
    const diff = genDiff(file1, file2);
    if (options.format === 'stylish') {
      console.log(style(diff));
    } else {
      console.log(diff);
    }
  });

program.parse(process.argv);

const options = program.opts();
if (options.version) console.log(options.version);

export default genDiff;
