class GameLobby {
  constructor(data = {}) {
    this.id = null;
    this.admin = null;
    this.pin = null;
    this.players = null;
    this.gamestatus = null;
    Object.assign(this, data);
  }
}