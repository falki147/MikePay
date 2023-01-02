export function generalSort(arr, key, asc) {
  return arr.sort((a, b) => {
    let result = 0;
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      result = a[key] - b[key];
    }
    else {
      result = String(a[key]).localeCompare(String(b[key]));
    }

    return asc ? result : -result;
  });
};
