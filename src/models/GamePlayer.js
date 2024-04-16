class GamePlayer {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.shame_tokens = null;
    this.gamelobby = null;
    this.game = null;
    this.cards = null;
    Object.assign(this, data);
  }
}
