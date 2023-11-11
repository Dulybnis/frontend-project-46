// @ts-check

import fs from 'fs';
import { test, expect } from '@jest/globals';
import genDiff from '../src/startdiff.js';

const file1 = ('./__fixtures__/file1.json');
const file2 = ('./__fixtures__/file2.json');
const filedeep1 = ('./__fixtures__/filedeep1.json');
const filedeep2 = ('./__fixtures__/filedeep2.json');
const diff = '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}';
const diff2 = '{\n  + follow: false\n    host: hexlet.io\n  + proxy: 123.234.53.22\n  - timeout: 20\n  + timeout: 50\n  - verbose: true\n}';
const diffdeep = fs.readFileSync('./__tests__/diffdeep.txt', 'utf-8');
const diffdeepplain = fs.readFileSync('./__tests__/diffdeepplain.txt', 'utf-8');
const diffdeepjson = fs.readFileSync('./__tests__/json.json', 'utf-8');
// console.log(diffdeep);
/* const diffdeep2 = '{
  \n    host: hexlet.io\n  - timeout: 20\n  + timeout: 50\n  - verbose: true\n
    + follow: false\n  + proxy: 123.234.53.22\n
}'; */

test('json diff', () => {
  expect(genDiff(file1, file2, 'stylish')).toBe(diff);
  expect(genDiff(file2, file1, 'stylish')).toBe(diff2);
});

test('jsondeep diff', () => {
  expect(genDiff(filedeep1, filedeep2, 'stylish')).toBe(diffdeep);
  // expect(genDiff(filedeep2, filedeep1)).toBe(diffdeep2);
});

test('jsondeep diff plain', () => {
  expect(genDiff(filedeep1, filedeep2, 'plain')).toBe(diffdeepplain);
});

test('jsondeep diff json', () => {
  expect(genDiff(filedeep1, filedeep2, 'json')).toBe(diffdeepjson);
});
