"use client";
import axios from "axios";
import { BotIcon, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const res = await axios.post("/api/chat", { message: input });
            setMessages([...newMessages, { role: "ai", content: res.data.reply }]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
            {/* Header */}
            <div className="p-4 text-center border-b border-gray-700">
                <h2 className="text-xl font-bold">Chat with AI</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-3 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "ai" && <BotIcon className="w-5 h-5 text-gray-400" />}
                        <div className={`p-3 rounded-lg max-w-[75%] ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-200"}`}>
                            {msg.role === "ai" ? (
                                <ReactMarkdown >{msg.content}</ReactMarkdown>
                            ) : (
                                <span>{msg.content}</span>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-gray-700 bg-gray-800 fixed bottom-0 w-full flex">
                <div className="w-full max-w-4xl mx-auto flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 p-3 bg-gray-700 text-white rounded-lg outline-none w-full"
                        placeholder="Ask about any news, enter any url to get its news"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        className="bg-blue-600 px-4 py-2 rounded-lg text-white flex items-center"
                        onClick={sendMessage}
                    >
                        <Send className="w-4 h-4 mr-1" /> Send
                    </button>
                </div>
            </div>
        </div>
    );
}
