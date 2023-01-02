export class BaseRepository {
  constructor(persistor, key) {
    this.persistor = persistor;
    this.key = key;
    this.data = this.persistor.get(this.key);
  }

  find(id) {
    return this.data.find(o => o.id === id) ?? null;
  }

  findOneBy(values) {
    const result = this.findAllBy(values);
    return result.length ? result[0] : null;
  }

  findAllBy(values) {
    return this.data.filter(o => {
      for (const key in values) {
        if (o[key] !== values[key]) {
          return false;
        }
      }

      return true;
    });
  }

  findAll() {
    return this.data;
  }

  persist(obj) {
    obj.id = Math.max(0, ...this.data.map(o => o.id)) + 1;
    this.data.push(obj);
  }

  remove(obj) {
    this.data = this.data.filter(o => o !== obj);
  }

  flush() {
    this.persistor.set(this.key, this.data);
  }
};
