
import React, { useState } from "react";

export default function ChatGPTv6() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm Chat GPT v6.0. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...messages.map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      const botMsg = {
        type: "bot",
        text: data.choices?.[0]?.message?.content || "(No response)"
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: "Error fetching response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-green-400 drop-shadow-lg">Chat GPT v6.0</h1>
      <div className="max-w-xl mx-auto bg-gray-800 rounded-2xl p-4 shadow-2xl">
        <div className="h-96 overflow-y-auto space-y-2 mb-4 border p-2 rounded">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap shadow-md ${
                msg.type === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-gray-400">Typing...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-xl bg-gray-700 text-white"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-green-500 px-4 py-2 rounded-xl text-white hover:bg-green-600"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-400 mt-6">
        &copy; 2025 Chat GPT v6.0. Built by Satish.
      </footer>
    </div>
  );
}
