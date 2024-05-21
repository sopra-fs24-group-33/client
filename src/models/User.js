class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.gamesPlayed = null;
    this.shame_tokens = null;
    this.password = null;
    this.roundsWon = null;
    this.flawlessWins = null;
    Object.assign(this, data);
  }
}

export default User;
