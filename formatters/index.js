import style from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatter = (diff, option) => {
  if (option === 'plain') {
    return plain(diff);
  }
  if (option === 'stylish') {
    return style(diff);
  }
  if (option === 'json') {
    return json(diff);
  }
  if (option === 'without') {
    return diff;
  }
  return style(diff);
};

export default formatter;
