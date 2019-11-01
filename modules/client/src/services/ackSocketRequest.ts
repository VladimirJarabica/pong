import uuidv1 from "uuid/v1";

// Socket request with acknowledgment
const ackSocketRequest = (
  socket: WebSocket,
  data: any,
  timeout: number = 2000
) =>
  new Promise((resolve, reject) => {
    const messageId = uuidv1();
    let messageListener: EventListener;
    let timeoutEvent: number;

    messageListener = event => {
      // @ts-ignore
      const parsed = JSON.parse(event.data);
      if (parsed.id === messageId) {
        delete parsed.id;
        socket.removeEventListener("message", messageListener);
        clearTimeout(timeoutEvent);
        resolve(parsed);
        return;
      }
    };

    socket.send(JSON.stringify({ ...data, id: messageId }));

    socket.addEventListener("message", messageListener);

    // @ts-ignore
    timeoutEvent = setTimeout(() => {
      console.log("timeout event");
      socket.removeEventListener("message", messageListener);
      reject();
    }, timeout);
  });

export default ackSocketRequest;
