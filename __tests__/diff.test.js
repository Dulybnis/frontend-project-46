// @ts-check

import fs from 'fs';
import { test, expect } from '@jest/globals';
import genDiff from '../src/startdiff.js';

const extensions = ['yml', 'json'];

const expectrdStylish = fs.readFileSync('./__tests__/expectedStylish.txt', 'utf-8');
const expectedPlain = fs.readFileSync('./__tests__/expectedPlain.txt', 'utf-8');
const expectedJson = fs.readFileSync('./__tests__/expectedJson.json', 'utf-8');

const readFixtures = (path) => (`./__fixtures__/${path}`);

test.each(extensions)('.add(%s)', (ext) => {
  const fileBefore = readFixtures(`file1.${ext}`);
  const fileAfter = readFixtures(`file2.${ext}`);
  expect(genDiff(fileBefore, fileAfter, 'plain')).toBe(expectedPlain);
  expect(genDiff(fileBefore, fileAfter, 'stylish')).toBe(expectrdStylish);
  expect(genDiff(fileBefore, fileAfter, 'json')).toBe(expectedJson);
  expect(genDiff(fileBefore, fileAfter)).toBe(expectrdStylish);
});
