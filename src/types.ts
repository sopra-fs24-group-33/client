export type User = {
  username: string;
  id: number;
  token: string;
  gamesplayed: number;
  shame_tokens: number;
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
  adminid: number;
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
