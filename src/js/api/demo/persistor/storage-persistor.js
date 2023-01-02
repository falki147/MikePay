export class StoragePersistor {
  constructor(storage, keyPrefix) {
    this.storage = storage;
    this.keyPrefix = keyPrefix;
  }

  get(key) {
    const data = this.storage.getItem(this.keyPrefix + key);
    if (data === null) {
      return null;
    }

    return JSON.parse(data);
  }

  getOrCreate(key, creator) {
    const data = this.get(key);
    if (data !== null) {
      return data;
    }

    this.set(key, creator());
    return this.get(key);
  }

  set(key, value) {
    if (value === null) {
      this.storage.removeItem(this.keyPrefix + key);
    }
    else {
      this.storage.setItem(this.keyPrefix + key, JSON.stringify(value));
    }
  }
};
