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
  const pin = localStorage.getItem("pin")
  const playerId = Number(localStorage.getItem("id"))
  const [drawPhase, setDrawPhase] = useState<boolean>(true) // Set initial draw phase true
  const [game, setGame] = useState<Game>(null)
  const [playerHand, setPlayerHand] = useState<number[]>([]) // Own cards
  const [cardsPlayed, setCardsPlayed] = useState<number[]>([]); // Cards played
  const [teamMates, setTeamMates] = useState<GamePlayer[]>(null)

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/gamelobbies/${pin}`);


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
  }, []);

  const handleDrawCards = async () => {
    try {
      const response = await api.post(`/startgame/${pin}`);
      setGame(response.data);
      console.log(response.data.players.find(p => p.id === playerId))
      const player = new GamePlayer(response.data.players.find(p => p.id === playerId));
      setPlayerHand(player.cards);
      setDrawPhase(false)
    } catch (error) {
      console.error(`Failed to start game: ${handleError(error)}`);
      alert("Failed to start game, check console for details.");
    }
  }

  const handleCardClick = (cardValue: number) => {
    console.log("Card clicked with value:", cardValue);
    // Add the card to the played cards pile
    setCardsPlayed(prev => [...prev, cardValue]);
    // Remove card from players hand
    setPlayerHand(playerHand.filter(n => n !== cardValue))
  };

  let teamContent = teamMates ? (
    teamMates.map((player) => (
      <div className="teammate-box" key={player.id}>
        <div className="webcam-container">{player.name}</div>
        <div className="matehand-container">
          <MateHand count={player.cards.length} />
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
            <PlayerHand cardValues={playerHand} onClick={handleCardClick}/>
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
