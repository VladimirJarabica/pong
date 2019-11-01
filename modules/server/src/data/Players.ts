import WebSocket from "ws";
import uuidv1 from "uuid/v1";

export type Player = {
  playerId: string;
  name: string;
  game: string | null;
  connection: WebSocket;
};

const players: { [index: string]: Player } = {};

export const registerPlayer = (name: string, ws: WebSocket) => {
  const playerId = uuidv1();
  players[playerId] = {
    playerId,
    name,
    game: null,
    connection: ws
  };

  return playerId;
};

export default players;
