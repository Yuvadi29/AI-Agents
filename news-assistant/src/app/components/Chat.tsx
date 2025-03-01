"use client";
import axios from "axios";
import { BotIcon } from "lucide-react";
import { useState } from "react";

export default function Chat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        // Call backend API
        const res = await axios.post("/api/chat", { message: input })
        const data = res;

        setMessages([...newMessages, { role: "ai", content: data.data.reply }]);
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">💬 AI News Chat</h2>
            <div className="h-80 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                        <strong>{msg.role === "user" ? "You" : <BotIcon />}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            <div className="flex mt-4">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-l-lg"
                    placeholder="Ask me about the latest tech news..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
