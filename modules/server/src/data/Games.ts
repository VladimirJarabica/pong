import uuidv1 from "uuid/v1";
import { Player } from "./Players";
import { MESSAGES } from "./consts";

export type Game = { author: string; waiting: boolean; players: string[] };

const games: { [index: string]: Game } = {};

export const createGame = (
  players: { [index: string]: Player },
  playerId: string
) => {
  const gameId = uuidv1();
  games[gameId] = {
    author: playerId,
    waiting: true,
    players: [playerId]
  };

  players[playerId].game = gameId;

  return gameId;
};

export const destroyGame = (
  players: { [index: string]: Player },
  playerId: string
) => {
  const destroyGameId = players[playerId!].game;
  if (!destroyGameId || !games[destroyGameId]) {
    return false;
  }
  const destroyGame = games[destroyGameId];
  destroyGame.players.forEach(pId =>
    players[pId].connection.send(
      JSON.stringify({ message: MESSAGES.GAME_DESTROYED })
    )
  );
  return true;
};

export const joinGame = (
  gameId: string,
  players: { [index: string]: Player },
  playerId: string
) => {
  if (!gameId || !games[gameId] || !games[gameId].waiting) {
    return false;
  }
  const game = games[gameId];
  game.players.push(playerId!);
  game.waiting = false;
  players[game.author].connection.send(
    JSON.stringify({ message: "user joined the game" })
  );

  return true;
};

export default games;
