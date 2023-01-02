import { BaseRepository } from "./base-repository";

export class Users extends BaseRepository {
  constructor(persistor) {
    super(persistor, 'users');
  }

  authenticate(username, password) {
    if (password !== 'Test1234') {
      return null;
    }

    return this.findAll().find(u => u.username === username);
  }
};
