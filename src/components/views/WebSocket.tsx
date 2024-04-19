import React, { useState, useEffect } from 'react';

const WebSocketComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws');

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      ws.send(input);
      setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 style={{ margin: '0', padding: '10px' }}>WebSocket Chat</h1>
      <div style={{ flex: '1', overflow: 'auto', padding: '10px', backgroundColor: 'black', color: 'white' }}>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', padding: '10px', backgroundColor: 'white' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          style={{ flex: '1', marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>

  );
};

export default WebSocketComponent;
