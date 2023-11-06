import style from './stylish.js';
import plain from './plain.js';

const formatter = (diff, option) => {
  if (option === 'plain') {
    return plain(diff);
  }
  if (option === 'stylish') {
    return style(diff);
  }
  return 'unknown formatter';
};

export default formatter;
