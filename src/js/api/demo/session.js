export class Session {
  constructor(persistor) {
    this.persistor = persistor;
    this.persistorKey = 'loggedInUser';
    this.loggedInUserIdData = this.persistor.get(this.persistorKey);
  }

  get loggedInUserId() {
    return this.loggedInUserIdData;
  }

  set loggedInUserId(id) {
    this.loggedInUserIdData = id;
    this.persistor.set(this.persistorKey, this.loggedInUserIdData);
  }
};
