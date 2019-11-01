import React, { useRef, useEffect, useState } from "react";

import ackSocketRequest from "./ackSocketRequest";

const GameContext = React.createContext({});

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const GameProvider = ({ children }: Props) => {
  const socketRef = useRef<WebSocket>(new WebSocket("ws://localhost:8000/ws"));

  const [connectionOpened, setConnectionOpened] = useState<boolean>(false);

  useEffect(() => {
    // new websocket set to socketRef
    socketRef.current.addEventListener("open", async event => {
      console.log("opened");
      setConnectionOpened(true);
      await registerUser("vladko");
      await createGame();
      await destroyGame();
      // socketRef.current.send("Hello Server!");
    });

    socketRef.current.addEventListener("message", function(event) {
      console.log("Message from server ", event.data);
    });

    const socket = socketRef.current;
    return () => {
      socket.close();
    };
  }, []);

  const registerUser = async (name: string) => {
    try {
      const result = await ackSocketRequest(socketRef.current, {
        action: "registerPlayer",
        registerPlayer: {
          name
        }
      });
      console.log("user registered", result);
    } catch (err) {
      console.log("error", err);
    }
  };

  const createGame = async () => {
    try {
      const result = await ackSocketRequest(socketRef.current, {
        action: "createGame"
      });
      console.log("created game", result);
    } catch (err) {
      console.log("error", err);
    }
  };

  const destroyGame = async () => {
    try {
      const result = await ackSocketRequest(socketRef.current, {
        action: "destroyGame"
      });
      console.log("destroyed game", result);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <GameContext.Provider value={{ connectionOpened }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
