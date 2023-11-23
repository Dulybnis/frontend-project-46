import style from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatter = (diff, option) => {
  switch (option) {
    case 'plain':
      return plain(diff);

    case 'stylish':
      return style(diff);

    case 'json':
      return json(diff);

    case 'without':
      return diff;

    default:
      throw new Error(`Invalid data - ${option}`);
  }
};

export default formatter;
