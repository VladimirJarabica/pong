import WebSocket from "ws";
import express from "express";
import http from "http";

import handleMessage from "./handleMessage";
import players from "./data/Players";
import games from "./data/Games";
import { MESSAGES } from "./data/consts";

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: "/ws" });

wss.on("connection", ws => {
  const connectionContext: { playerId: string | null } = {
    playerId: null
  };

  ws.on("message", (message: string) => {
    const parsed = JSON.parse(message);
    try {
      const response = handleMessage(connectionContext, ws, parsed);
      ws.send(JSON.stringify({ ...response, id: parsed.id }));
    } catch (err) {
      console.log("error", err);
      ws.send(JSON.stringify({ success: false, id: parsed.id }));
    }
  });

  ws.on("close", () => {
    // console.log("close");

    if (!connectionContext.playerId) return;

    const player = players[connectionContext.playerId];

    if (player.game && games[player.game]) {
      // TODO: notify all players the game has been destroyed
      games[player.game].players.forEach(pId =>
        players[pId].connection.send(
          JSON.stringify({ message: MESSAGES.GAME_DESTROYED })
        )
      );
      delete games[player.game];
    }

    delete players[connectionContext.playerId];
  });
});

app.get("/games", (_, res) => {
  res.json(games);
  //   res.json(Object.values(games).filter(game => game.waiting));
});

console.log("started");
server.listen(8000);
