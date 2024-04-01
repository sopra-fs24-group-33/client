export type User = {
  username: string;
  name: string;
  id: number;
  token: string;
};

export type Player = {
  guestname: string;
  name: string;
  id: number;
  token: string;
  shame_tokens : number;
};

export type Lobby = {
  id: number;
  pin: number;
  admin: number;
  gameStatus: string;
  players: Player[];
};
