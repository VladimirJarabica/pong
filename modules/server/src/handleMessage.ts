import WebSocket from "ws";

import players, { registerPlayer } from "./data/Players";
import { createGame, destroyGame, joinGame } from "./data/Games";

type Message =
  | { action: "registerPlayer"; registerPlayer: { name: string } }
  | {
      action: "joinGame";
      joinGame: { gameId: string };
    }
  | { action: "createGame" }
  | { action: "destroyGame" };

const handleMessage = (
  connectionContext: { playerId: string | null },
  ws: WebSocket,
  message: Message
) => {
  switch (message.action) {
    case "registerPlayer":
      connectionContext.playerId = registerPlayer(
        message.registerPlayer.name,
        ws
      );
      return { playerId: connectionContext.playerId, success: true };
    case "createGame":
      const gameId = createGame(players, connectionContext.playerId!);
      return { gameId, success: true };
    case "destroyGame":
      const successDestroyGame = destroyGame(
        players,
        connectionContext.playerId!
      );
      return { success: successDestroyGame };
    case "joinGame":
      // gameId - game that player wants to join
      // {action: "joinGame", payload: { gameId: "12345" }}
      const successJoinGame = joinGame(
        message.joinGame.gameId,
        players,
        connectionContext.playerId!
      );
      return { success: successJoinGame };
  }
};

export default handleMessage;
