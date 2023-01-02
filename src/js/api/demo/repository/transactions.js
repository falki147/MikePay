import { BaseRepository } from "./base-repository";

export class Transactions extends BaseRepository {
  constructor(persistor) {
    super(persistor, 'transactions');
  }
};
