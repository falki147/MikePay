export class Random {
  static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  static item(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static itemQuad(arr, f = 1/3) {
    const rand = Math.random();
    const fact = (rand * f + rand * rand * (1 - f));

    return arr[Math.floor(fact * arr.length)];
  }

  static integer(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }
};
