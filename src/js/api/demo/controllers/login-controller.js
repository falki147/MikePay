export class LoginController {
  constructor(session, users) {
    this.session = session;
    this.users = users;
  }

  login(body) {
    const user = this.users.authenticate(body.username, body.password);
    if (!user) {
      throw Error("Benutzer wurde nicht gefunden");
    }

    this.session.loggedInUserId = user.id;
    return {
      ...user
    };
  }

  logout() {
    this.session.loggedInUserId = null;
  }
}
