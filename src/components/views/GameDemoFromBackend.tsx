import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

const GameDemoFromBackend = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(null);
  const [lobby, setLobby] = useState(null);
  const [integerValue, setIntegerValue] = useState(""); // State variable for the integer value

  const startGame = async () => {
    const pin = localStorage.getItem("pin");
    const response = await api.post(`/startgame/${pin}`);
    const gamestatus = response.data;
    console.log(gamestatus)
  };

  const handleIntegerChange = (event) => {
    // Function to handle changes in the text field
    setIntegerValue(event.target.value);
  };

  const doMove = async () => {

  };

  useEffect(() => {
    async function fetchData() {
      const lobbyPin = localStorage.getItem("pin");
      try {
        const response = await api.get(`/gamelobbies/${lobbyPin}`);
        setLobby(response.data);
        setPlayers(response.data.players);
      } catch (error) {
        console.error(`Error fetching data: ${handleError(error)}`);
        alert("Error fetching data. Please check console for details.");
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;
  let displayPin = null;

  if (players) {
    content = (
      <div className="overview">
        <ul className="overview user-list">
          {players.map((player) => (
            <li key={player.id}>
              {/* Render player details */}
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
    <div>
      <BaseContainer className="overview container">
        <h2>Game Pin</h2>
        <h1>{displayPin}</h1>
        <hr className="overview hr-thin" />
        <div className="overview player-container">{content}</div>
      </BaseContainer>
      <div className="overview button-container">
        <Button className="primary-button" width={300} onClick={startGame}>
          Start Game
        </Button>
        <input
          type="text"
          value={integerValue}
          onChange={handleIntegerChange}
          placeholder="Enter an integer"
        />
        <Button className="primary-button" width={300} onClick={doMove}>
          Do Move
        </Button>
      </div>
    </div>
  );
};

export default GameDemoFromBackend;
