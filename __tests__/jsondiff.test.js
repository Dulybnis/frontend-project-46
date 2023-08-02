// @ts-check

import { test, expect } from '@jest/globals';
import genDiff from '../src/startdiff.js';

const file1 = ('./fixtures/file1.json');
const file2 = ('./fixtures/file2.json');
const diff = '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}';
const diff2 = '{\n    host: hexlet.io\n  - timeout: 20\n  + timeout: 50\n  - verbose: true\n  + follow: false\n  + proxy: 123.234.53.22\n}';

test('json diff', () => {
  expect(genDiff(file1, file2)).toBe(diff);
  expect(genDiff(file2, file1)).toBe(diff2);
});
