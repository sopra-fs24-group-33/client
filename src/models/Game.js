
class GameLobby {
  constructor(data = {}) {
    this.id = null;
    this.cards = null;
    this.players = null;
    this.currentCard = null;
    this.level = null;
    this.successfulMove = null;
    Object.assign(this, data);
  }
}