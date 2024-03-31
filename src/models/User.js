/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.current_shame_tokens = null;
    this.username = null;
    this.password = null;
    this.shame_tokens = null;
    this.gamesPlayed = null;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}
