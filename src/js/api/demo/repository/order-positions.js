import { BaseRepository } from "./base-repository";

export class OrderPositions extends BaseRepository {
  constructor(persistor) {
    super(persistor, 'orderPositions');
  }
};
