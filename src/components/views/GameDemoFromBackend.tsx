import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import CardFront from "../ui/cards/CardFront";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Player } from "../../types";

const GameDemoFromBackend = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(null);
  const [lobby, setLobby] = useState(null);
  const [integerValue, setIntegerValue] = useState(""); // State variable for the integer value

  const [currentPlayer, setCurrentPlayer] = useState<Player>(null);
  const [playerCards, setPlayerCards] = useState<number[]>(null);

  const startGame = async () => {
    const pin = localStorage.getItem("pin");
    try {
      const response = await api.post(`/startgame/${pin}`);
      const gamestatus = response.data;
      localStorage.setItem("gameid", gamestatus.id);
      setPlayers(gamestatus.players);

      // Set the current player and their cards
      const currentPlayerId = localStorage.getItem("id");  // Assuming the current player's ID is stored in localStorage
      const currentPlayer = gamestatus.players.find(player => player.id === Number(currentPlayerId));
      if (currentPlayer) {
        setCurrentPlayer(currentPlayer);
        setPlayerCards(currentPlayer.cards);  // Assuming that player object has a 'cards' field
      }
    } catch (error) {
      console.error(`Error starting game: ${handleError(error)}`);
      alert("Failed to start game. Please check console for details.");
    }
  };


  const handleIntegerChange = (event) => {
    // Function to handle changes in the text field
    setIntegerValue(event.target.value);
  };

  const doMove = async () => {
    const id = localStorage.getItem("gameid");
    const current = await api.get(`/game/${id}`);
    console.log(current.data)
    const response = await api.put(`/move/${id}`, integerValue);
    const gamestatus = response.data;
    console.log(gamestatus)

  };

  useEffect(() => {
    async function fetchData() {
      const lobbyPin = localStorage.getItem("pin");
      try {
        const response = await api.get(`/gamelobbies/${lobbyPin}`);
        console.log(response.data)
        setLobby(response.data);
        setPlayers(response.data.players);
      } catch (error) {
        console.error(`Error fetching data: ${handleError(error)}`);
        alert("Error fetching data. Please check console for details.");
      }

      try {
        const playerId = localStorage.getItem("id")
        const response2 = await api.get(`/players/${playerId}`)

        const player = response2.data;
        setCurrentPlayer(player)

      } catch (error) {
        console.error(`Error fetching data: ${handleError(error)}`)
        alert("Error fetching data. Please check console for details.")
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
        <div>
          {playerCards && playerCards.length > 0 && (
            <CardFront value={playerCards[0]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDemoFromBackend;
