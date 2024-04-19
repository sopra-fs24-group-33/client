// Lobby.js

import React, { useEffect, useState } from 'react';

const Lobby = () => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    const lobbyPin = localStorage.getItem('pin'); // Assume you store lobbyPin in localStorage
    const socket = new WebSocket(`ws://localhost:8080/ws/lobby?lobby=${lobbyPin}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const newLobby = JSON.parse(event.data);
      setLobby(newLobby);
      console.log("Received data:", newLobby);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      {messages.map((msg, index) => (
        <p key={index}>{msg.text}</p>
      ))}
    </div>
  );
};

export default Lobby;
