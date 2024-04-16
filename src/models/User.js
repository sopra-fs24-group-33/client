/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.gamesplayed = null;
    this.shame_tokens = null;
    this.password = null;
    Object.assign(this, data);
  }
}

export default User;
