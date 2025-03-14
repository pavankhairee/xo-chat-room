import React, { useEffect, useRef, useState } from 'react';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  // ✅ Connect WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setSocket(ws);
    };

    // ✅ Handle incoming messages (including from Postman)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "joined") {
        setRoomId(data.roomId);
        console.log(`Room ID: ${data.roomId}`);
      }

      if (data.type === "chat") {
        setChat((prev) => [...prev, data.payload]); // ✅ Display message in chat
      }
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);


  const joinRoom = () => {
    const enteredRoomId = inputRef.current?.value;
    if (socket && enteredRoomId) {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: enteredRoomId },
        })
      );
    }
  };


  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [chat]);


  const sendMessage = () => {
    if (socket && message && roomId) {
      socket.send(
        JSON.stringify({
          type: "chat",
          payload: { roomId, message },
        })
      );
      setMessage("");
    }
  };

  // ✅ Generate Room ID
  const generateRoomId = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: null },
        })
      );
    }
  };

  return (
    <div className="p-4">
      <div className="border flex  bg-cyan-200 p-2">
        <div>
          <h4>Generate a room ID:</h4>
          <button onClick={generateRoomId} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Generate</button>
          {roomId && <span className="ml-2">Room ID: {roomId} </span>}
        </div>
        <div>
          Room ID:
          <input ref={inputRef} className="rounded-md border-black p-2 ml-2" type="text" placeholder="Enter the room ID" />
          <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      </div>


      {/* <div
        ref={messageRef}
        className="border p-2 h-60 overflow-y-auto bg-gray-100 mt-4"
      >
        {chat.map((msg, index) => (
          <div key={index} className="py-1 px-2 rounded bg-white shadow-sm mb-1">
            {msg}
          </div>
        ))}
      </div>


      <div className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 w-full"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div> */}
    </div>
  );
}

export default App;
