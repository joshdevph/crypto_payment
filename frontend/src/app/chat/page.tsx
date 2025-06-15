'use client';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error fetching response' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-4 flex flex-col flex-1">
        <h1 className="text-xl font-semibold mb-4">ChatGPT Assistant</h1>
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-prose ${m.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'}`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="p-3 bg-gray-100 rounded-lg">Thinking...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
