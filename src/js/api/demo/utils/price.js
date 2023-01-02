export class Price {
    constructor() {
      this.value = 0;
    }

    get centValue() {
      return this.value;
    }

    toString() {
      const normalPart = Math.floor(this.value / 100);
      const decimalPart = this.value % 100;
      const prefix = this.value < 0 ? '-' : '';

      return `${prefix}${Math.abs(normalPart)},${Math.abs(decimalPart).toFixed().padStart(2, '0')}`;
    }

    static parse(value) {
      if (typeof value === 'number') {
        const price = new Price();
        price.value = Math.floor(100 * value);
        return price;
      }

      const matches = value.match(/^\s*(-?)\s*(\d*)\s*,?\s*(\d*)\s*$/);
      if (!matches) {
          throw new Error('invalid price');
      }

      const [, minus, normalPart, decimalPart] = matches;

      // Ateleast one must be not empty
      if (normalPart == '' && decimalPart == '') {
        throw new Error('invalid price');
      }

      const price = new Price();
      price.value = 100 * Math.ceil(Number(normalPart)) + Number(decimalPart.substring(0, 2));

      if (minus === '-') {
        price.value = -price.value;
      }

      return price;
    }

    static fromCentValue(value) {
      const price = new Price();
      price.value = Math.ceil(value);
      return price;
    }
};
