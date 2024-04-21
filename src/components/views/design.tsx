import React, { useState } from "react";
import "styles/views/Game.scss";
import BaseContainer from "../ui/BaseContainer";
import PlayerHand from "../ui/cards/PlayerHand";
import CardPile from "../ui/cards/CardPile";
import MateHand from "../ui/cards/MateHand";
// @ts-ignore
import shameLogo from "../../assets/shame_logo.svg"

const GameArena = () => {
  const [playerCards, setPlayerCards] = useState<number[]>([]);

  const handleCardClick = (cardValue: number) => {
    console.log("Card clicked with value:", cardValue);
    // Add the card to the played cards pile
    setPlayerCards(prev => [...prev, cardValue]);
  };

  return (
    <BaseContainer style={{
      margin: '0px',
      padding: '0px',
    }}>
      <div className="game container">
        <div className="teammates-container">
          <div className="teammate-box">
            <div className="webcam-container">
              Webcam
            </div>
            <div className="matehand-container">
              <MateHand count={5} />
            </div>
          </div>
          <div className="teammate-box">
            <div className="webcam-container">
              Webcam
            </div>
            <div className="matehand-container">
              <MateHand count={5} />
            </div>
          </div>
          <div className="teammate-box">
            <div className="webcam-container">
              Webcam
            </div>
            <div className="matehand-container">
              <MateHand count={5} />
            </div>
          </div>
          <div className="teammate-box">
            <div className="webcam-container">
              Webcam
            </div>
            <div className="matehand-container">
              <MateHand count={5} />
            </div>
          </div>
        </div>
        <div className="game-arena-container">
          <div className="game-arena-container table-border">
            <div className="game-arena-container table">
              <div className="confetti-container">
                <img src={shameLogo} className="confetti-emoji"
                     alt="Confetti Emoji" />
                <img src={shameLogo} className="confetti-emoji"
                     alt="Confetti Emoji" />
                <img src={shameLogo} className="confetti-emoji"
                     alt="Confetti Emoji" />
              </div>

              <CardPile onCardPlayed={handleCardClick} cards={playerCards} />
            </div>
          </div>
        </div>
        <div className="pov-container">
          <div className="pov-container hand">
            <PlayerHand cardValues={[2, 24, 52, 89, 99, 21, 32]} onClick={handleCardClick} />
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
