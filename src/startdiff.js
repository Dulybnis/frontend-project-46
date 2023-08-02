import path from 'path';
import fs from 'fs';

const genDiff = (file1, file2) => {
  const comparedFile1 = JSON.parse(fs.readFileSync(path.resolve(file1)));
  const comparedFile2 = JSON.parse(fs.readFileSync(path.resolve(file2)));
  const valueOfFile1 = Object.keys(comparedFile1).sort();
  const valueOfFile2 = Object.keys(comparedFile2).sort();
  let compares = valueOfFile1.reduce((acc, key) => {
    let newAcc = [];
    if (!valueOfFile2.includes(key)) {
      const nextValue = `  - ${key}: ${comparedFile1[key]}`;
      newAcc = [...acc, nextValue];
    } else if (comparedFile1[key] === comparedFile2[key]) {
      const nextValue = `    ${key}: ${comparedFile1[key]}`;
      newAcc = [...acc, nextValue];
      valueOfFile2.splice(valueOfFile2.indexOf(key), 1);
    } else {
      const nextValue1 = `  - ${key}: ${comparedFile1[key]}`;
      const nextValue2 = `  + ${key}: ${comparedFile2[key]}`;
      newAcc = [...acc, nextValue1, nextValue2];
      valueOfFile2.splice(valueOfFile2.indexOf(key), 1);
    }
    return newAcc;
  }, []);
  valueOfFile2.forEach((key) => {
    const nextValue = `  + ${key}: ${comparedFile2[key]}`;
    compares = [...compares, nextValue];
  });

  return (`{\n${compares.join('\n')}\n}`);
};

export default genDiff;

/* import { program } from 'commander';

program
  .name('genDiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format')
  .parse(process.argv);

program.parse();

const options = program.opts();
if (options.version) console.log(options.version);
if (options.help) console.log('help is not help'); */
