import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { Game } from "types";
import GamePlayer from "models/GamePlayer";
import MateHand from "../ui/cards/MateHand";
import CardPile from "../ui/cards/CardPile";
import PlayerHand from "../ui/cards/PlayerHand";


const GameArena = () => {
  const navigate = useNavigate();
  const gameId = localStorage.getItem("gameId")
  const playerId = Number(localStorage.getItem("id"))
  const [drawPhase, setDrawPhase] = useState<boolean>(true) // Set initial draw phase true
  const [game, setGame] = useState<Game>(null)
  const [playerHand, setPlayerHand] = useState<number[]>([]) // Own cards
  const [cardsPlayed, setCardsPlayed] = useState<number[]>([]); // Cards played
  const [teamMates, setTeamMates] = useState<GamePlayer[]>(null)
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/game?game=${gameId}`);

    socket.onopen = () => {
      console.log("Connected to Game WebSocket")
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Game event received:", data);
      setCardsPlayed(prev => [...prev, data.currentCard]);

      // get current player
      const player = new GamePlayer(data.players.find(p => p.id === playerId));

      // get current level from local storage
      const currLvl = parseInt(localStorage.getItem("lvl"))
      console.log("new level:", data.level);

      if (data.level > currLvl) {
        setDrawPhase(true); // if new level , set draw phase true
        localStorage.setItem("lvl", data.level)// set new level to current level
        setPlayerHand(player.cards); // update current players hand
        setCardsPlayed([]) // clear cards played pile

      }
      setTeamMates(data.players.filter(p => p.id !== playerId))
    }

    socket.onclose = () => {
      console.log("Game WebSocket disconnected")
    }

    socket.onerror = (error) => {
      console.error('Game WebSocket error:', error);
    };

    setWs(socket);

    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}`);

        setGame(response.data);
        console.log(response.data.players.find(p => p.id === playerId))
        const player = new GamePlayer(response.data.players.find(p => p.id === playerId));
        setPlayerHand(player.cards);

        // set current level on local storage
        localStorage.setItem("lvl", response.data.level);
        console.log("level fetched & set:", response.data.level);

        console.log("requested data:", response.data.players);
        console.log("teammates:",response.data.players.filter(p => p.id !== playerId))
        setTeamMates(response.data.players.filter(p => p.id !== playerId))

      } catch (error) {
        console.error(
          `Something went wrong while fetching the dasdusers: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();

    return () => {
      socket.close();
    };
  }, []);

  const handleDrawCards = () => {
    setDrawPhase(false)
  }

  const handleCardClick = async (cardValue: number) => {
    console.log("Card clicked with value:", cardValue);
    const response = await api.put(`/move/${gameId}`, cardValue)
    ws.send(gameId)
    console.log("response data card click:", response.data)
    // Add the card to the played cards pile
    // Remove card from players hand
    setPlayerHand(playerHand.filter(n => n !== cardValue))
  };

  let teamContent = teamMates ? (
    teamMates.map((player) => (
      <div className="teammate-box" key={player.id}>
        <div className="webcam-container">{player.name}</div>
        <div className="matehand-container">
          {!drawPhase && (
            <MateHand count={player.cards.length} />
          )}
        </div>
      </div>
    ))
  ) : <Spinner />;

  let mainContent = drawPhase ? (
    <Button className="primary-button" onClick={handleDrawCards}>Draw Cards
    </Button>
  ) : <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} />

  return (
    <BaseContainer style={{
      margin: '0px',
      padding: '0px',
    }}>
      <div className="game container">

        <div className="teammates-container">
          {teamContent}
        </div>

        <div className="game-arena-container">
          <div className="game-arena-container table-border">
            <div className="game-arena-container table">
              {mainContent}
            </div>
          </div>
        </div>

        <div className="pov-container">
          <div className="pov-container hand">
            {!drawPhase && (
              <PlayerHand cardValues={playerHand} onClick={handleCardClick}/>
            )}
          </div>
          <div className="pov-container my-webcam">
            My Webcam
          </div>
        </div>

      </div>
    </BaseContainer>
  );
};

export default GameArena;
