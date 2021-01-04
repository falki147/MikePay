/**
 * Sleep for t microseconds
 * @param {Numebr} t
 */
export default function sleep(t) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, t);
  });
};
