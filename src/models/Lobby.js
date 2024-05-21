import { GamePlayer } from "../types";

/**
 * Lobby model
 */
class GameLobby {
  constructor(data = {}) {
    this.pin = null;
    this.admin = null;
    this.gameid = null;
    this.players = null;
    Object.assign(this, data);
  }
}

export default GameLobby;
