/**
 * User model
 */
class Player {
  constructor(data = {}) {
    this.id = null;
    this.guestname = null;
    this.name = null;
    this.token = null;
    this.shame_tokens = null;
    Object.assign(this, data);
  }
}

export default Player;
