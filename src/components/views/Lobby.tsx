import { api, handleError } from "helpers/api";
import React, { useEffect, useState } from 'react';
import { GameLobby, Player } from "../../types";
import { Spinner } from "../ui/Spinner";
import PlayerBox from "../ui/PlayerBox";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import "styles/views/Lobby.scss";

const Lobby = () => {
  const navigate = useNavigate();
  const lobbyPin = localStorage.getItem('pin');
  const playerId = localStorage.getItem("id");
  const adminId = localStorage.getItem("adminId")
  const [ws, setWs] = useState(null);
  const [lobby, setLobby] = useState<GameLobby>(null);
  const [players, setPlayers] = useState<Player[]>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/lobby?lobby=${lobbyPin}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const newLobby = JSON.parse(event.data);
      setLobby(newLobby);
      setPlayers(newLobby.players)
      if (newLobby.gameid) {
        console.log("Game started!");
        localStorage.setItem("gameId", newLobby.gameid);
        navigate("/game")
      }
      console.log("Received data:", newLobby);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    function handleBeforeUnload(event) {
      leaveLobby(); // Asynchronously try to notify the server
      // Optionally add a custom message to the event
      // event.returnValue = "Are you sure you want to leave?";
    }

    // Add the event listener for closing window/tab
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up function for useEffect
    return () => {
      socket.close();
      // Remove the event listener when the component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const leaveLobby = async () => {
    try {
      const player = lobby.players.find(p => p.id.toString() === playerId);
      const requestBody = JSON.stringify(player)
      console.log("player in lobby.tsx:", requestBody)
      const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)

      localStorage.removeItem("pin")
      localStorage.removeItem("adminId")

      navigate("/overview")
    } catch (error) {
      console.error(
        `Something went wrong while fetching the users: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the users! See the console for details."
      );
    }
  }

  const startGame = async () => {
    const response = await api.post(`/startgame/${lobbyPin}`);
    const gamestatus = response.data;
    localStorage.setItem("gameId", gamestatus.id);
    console.log(gamestatus)

    navigate("/game")
  };

  let content = <Spinner />
  let  displayPin = null

  if (players) {
    content = (
      <div className="overview">
        <ul className="overview user-list">
          {players.map((player: Player) => (
            <li key={player.id}>
              <PlayerBox
                username={player.name}
                shameTokens={player.shame_tokens}
                you={localStorage.getItem("id") === player.id.toString()}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (lobby) {
    const stringPin = lobby.pin.toString();
    displayPin = stringPin.substring(0, 3) + " " + stringPin.substr(3);
  }

  return (
    <div className="lobby section">
      <BaseContainer className="lobby container">
        <h2 className="lobby header">Game Pin: {displayPin}</h2>
        <hr className="lobby hr-thin" />
        <div className="lobby player-container">
          {content}
        </div>
        <div className="lobby button-container">
          <Button className="outlined" width="100%" onClick={() => leaveLobby()}>
            Leave Lobby
          </Button>
          <Button className="outlined" width="100%" onClick={() => ws.send(lobbyPin)}>
            Send WS MSG
          </Button>
          {/* Conditionally render the Start Game button */}
          {adminId === playerId && (
            <Button className="" width="100%" onClick={() => startGame()}>
              Start Game
            </Button>
          )}
        </div>
      </BaseContainer>


    </div>
  )
}

export default Lobby;