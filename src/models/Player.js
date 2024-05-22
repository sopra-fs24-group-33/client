class Player {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.token = null;
    this.shame_tokens = null;
    this.isuser = null;
    Object.assign(this, data);
  }
}

export default Player;
