class Game {
  constructor(data = {}) {
    this.id = null;
    this.lobbyid = null;
    this.cardStack = null;
    this.players = null;
    this.currentCard = null;
    this.successfulMove = null;
    this.level = null;
    Object.assign(this, data);
  }
}

export default Game;