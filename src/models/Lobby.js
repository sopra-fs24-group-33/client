/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.pin = null;
    this.admin = null;
    this.gamestatus = null;
    Object.assign(this, data);
  }
}

export default Lobby;
