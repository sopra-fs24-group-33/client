
class Player {
  constructor(data = {}) {
    this.id = null;
    this.cards = null;
    this.name = null;
    this.shame_tokens = null;
    this.gameLobby = null;
    this.game = null;
    Object.assign(this, data);
  }
}