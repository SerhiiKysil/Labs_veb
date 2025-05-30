const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
    console.log("🔌 Клієнт підключився");

    ws.on("message", (message) => {
        const text = message.toString(); 
        console.log("📩 Отримано:", text);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text);
            }
        });
    });

    ws.on("close", () => {
        console.log("❌ Клієнт відключився");
    });
});
