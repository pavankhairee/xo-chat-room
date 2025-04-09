import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

const allSockets = new Map<WebSocket, User>();

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());


            if (parsedMessage.type === "join") {
                const roomId =
                    parsedMessage.payload.roomId ||
                    Math.random().toString(36).substring(2, 10);

                allSockets.set(socket, { socket, room: roomId });

                socket.send(JSON.stringify({ type: "joined", roomId }));
            }

            if (parsedMessage.type === "chat") {
                const { roomId, message } = parsedMessage.payload;

                allSockets.forEach((client) => {
                    if (client.room === roomId && client.socket !== socket) {
                        client.socket.send(
                            JSON.stringify({ type: "chat", payload: message })
                        );
                    }
                });
            }
        } catch (error) {

        }
    });


    socket.on("close", () => {
        allSockets.delete(socket);
    });
});


