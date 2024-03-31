export type User = {
  username: string;
  id: number;
  password: string;
  token: string;
  current_shame_tokens: number;
  shame_tokens: number;
  status: string;
  gamesPlayed: number;
};

export type Guest = {
  guestname: string;
  id: number;
  token: string;
  shame_tokens: number;
  status: string;
  isUser: number;
};


export type Player = {
  id: number;
  name: string;
  cards: number[]; // List of integers
  shame_tokens: number;
  gameLobby: GameLobby;
  game: Game;
};

export type GameLobby = {
  id: number;
  cards: number[];
  pin: string;
  admin: number;
  players: Player[];
  gamestatus: Game;
};

export type Game = {
  id: number;
  cards: number[];
  players: Player[];
  currentCard: number;
  level: number;
  successfulMove: number;
};