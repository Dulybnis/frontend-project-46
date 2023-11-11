// @ts-check

import { test, expect } from '@jest/globals';
import genDiff from '../src/startdiff.js';

const file1 = ('./__fixtures__/file1.yml');
const file2 = ('./__fixtures__/file2.yml');
const diff = '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}';
const diff2 = '{\n  + follow: false\n    host: hexlet.io\n  + proxy: 123.234.53.22\n  - timeout: 20\n  + timeout: 50\n  - verbose: true\n}';

test('json diff', () => {
  expect(genDiff(file1, file2, 'stylish')).toBe(diff);
  expect(genDiff(file2, file1, 'stylish')).toBe(diff2);
});
