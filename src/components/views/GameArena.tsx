import React, { useEffect, useRef, useState } from "react";
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
import Popup from "../ui/PopUp";


const GameArena = () => {
  const navigate = useNavigate();
  const lobbyPin = localStorage.getItem("pin");
  const gameId = localStorage.getItem("gameId")
  const playerId = Number(localStorage.getItem("id"))
  const [drawPhase, setDrawPhase] = useState<boolean>(true) // Set initial draw phase true
  const [game, setGame] = useState<Game>(null)
  const [player, setPlayer] = useState<GamePlayer>(null);
  const [playerHand, setPlayerHand] = useState<number[]>([]) // Own cards
  const [cardsPlayed, setCardsPlayed] = useState<number[]>([]); // Cards played
  const [teamMates, setTeamMates] = useState<GamePlayer[]>(null)
  const [ws, setWs] = useState(null);
  const [moveStatus, setMoveStatus] = useState('');
  const [popupType, setPopupType] = useState<'win' | 'lose' | 'levelUp' | null>(null);
  const lastCardPlayTime = useRef(0);


  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/game?game=${gameId}`);

    socket.onopen = () => {
      console.log("Connected to Game WebSocket")
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Game event received:", data);
      setCardsPlayed(prev => [...prev, data.currentCard]);

      // COOLDOWNN
      const now = new Date().getTime();
      lastCardPlayTime.current = now;
      setTimeout(() => {
        // This timeout effectively ends the cooldown period.
        lastCardPlayTime.current = 0;
      }, 500); // Set cooldown for 1 second

      // get current player
      const currentPlayer = new GamePlayer(data.players.find(p => p.id === playerId));
      setPlayer(currentPlayer)

      // get current level from local storage
      const currLvl = parseInt(localStorage.getItem("lvl"))
      console.log("new level:", data.level);

      // animates border, TODO: winning and loosing [pop-up]
      handleMove(data.successfulMove);

      if (data.level > currLvl) {
        setPopupType('levelUp')
        setDrawPhase(true); // if new level , set draw phase true
        localStorage.setItem("lvl", data.level)// set new level to current level
        setPlayerHand(currentPlayer.cards); // update current players hand
      }
      // TODO: maybe sort the game players in backend instead of sorting it always here
      const sortedAndFilteredPlayers = data.players
        .filter(p => p.id !== playerId)
        .sort((a,b) => a.name.localeCompare(b.name));

      setTeamMates(sortedAndFilteredPlayers)
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
    fetchData();

    return () => {
      socket.close();
    };
  }, []);

  const closePopup = () => {
    setPopupType(null);
  };

  const handleNewGame = () => {
    navigate("/lobby")
  }

  const handleLeaveGame = async () => {
    const requestBody = JSON.stringify(player)
    console.log("player in game.tsx:", requestBody)
    const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
    localStorage.removeItem("pin")
    localStorage.removeItem("adminId")
    navigate("/overview")
  }

  const handleMove = (successfulMove : number) => {

    if (successfulMove === 1) {
      setMoveStatus('blink-success');
    } else if (successfulMove === 2) {
      setMoveStatus('blink-failure');
      setPopupType('lose')
    }
    setTimeout(() => {
      setMoveStatus('');
    }, 500); // Reset after 1 second
  }

  const handleDrawCards = () => {
    setDrawPhase(false)
    setCardsPlayed([]) // clear cards played pile
  }

  const handleCardClick = async (cardValue: number) => {
    const now = new Date().getTime();
    if (!lastCardPlayTime.current || now - lastCardPlayTime.current > 500) {
      console.log("Card clicked with value:", cardValue);
      const response = await api.put(`/move/${gameId}`, cardValue)
      ws.send(gameId)
      console.log("response data card click:", response.data)
      // Add the card to the played cards pile
      // Remove card from players hand
      setPlayerHand(playerHand.filter(n => n !== cardValue))
    } else {
      console.log("Wait for cooldown to end")
    }
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
    <div>
      <Button className="primary-button" onClick={handleDrawCards}>Draw Cards
      </Button>
      <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} />
    </div>
  ) : <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} />

  let tableClasses = `game-arena-container table ${moveStatus}`;

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
          {popupType && (
            <Popup
              type={popupType}
              isVisible={!!popupType}
              onClose={closePopup}
              onNewGame={handleNewGame}
              onLeaveGame={handleLeaveGame}
            />
          )}
          <div className="game-arena-container table-border">
            <div className={tableClasses}>
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
