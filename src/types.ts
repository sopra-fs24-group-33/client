export type User = {
  username: string;
  id: number;
  token: string;
  gamesPlayed: number;
  shame_tokens: number;
  flawlessWins: number;
  roundsWon: number;
  password: string;
};

export type Player = {
  id: number;
  token: string;
  name: string;
  shame_tokens: number;
  isuser: number;
};

export type GameLobby = {
  admin: number;
  pin: number;
  gameid: number;
  players: GamePlayer[];
};

export type Game = {
  gameid: number;
  lobbyid: number;
  cardStack: number[];
  players: GamePlayer[];
  currentCard: number;
  successfulMove: number;
  level: number;
};

export type GamePlayer = {
  id: number;
  name: string;
  shame_tokens: number;
  gamelobby: GameLobby;
  game: Game;
  cards: number[];
};
