"use client";
import React, { useEffect, useRef, useState } from "react";

const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:3001");

        socketRef.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        return () => {
            socketRef.current?.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(input);
            setInput("");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, color: "black" }}>
            <h2>💬 Чат на WebSocket</h2>
            <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto", color: "black" }}>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Введи повідомлення..."
                style={{ width: "80%", padding: 8, marginTop: 10, color: "black" }}
            />
            <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>
                Надіслати
            </button>
        </div>
    );
};

export default Chat;
