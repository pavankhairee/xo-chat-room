export function dashboard() {

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setSocket(ws);
        };


        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "joined") {
                setRoomId(data.roomId);
                console.log(`Room ID: ${data.roomId}`);
            }

            if (data.type === "chat") {
                setChat((prev) => [...prev, data.payload]);
            }
        };

        ws.onclose = () => console.log("WebSocket closed");

        return () => ws.close();
    }, []);


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
    return <>
        <div>
            ref={messageRef}
            className="border p-2 h-60 overflow-y-auto bg-gray-100 mt-4"

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
        </div>
    </>
}