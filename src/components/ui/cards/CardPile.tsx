import React from "react";
import CardFront from "./CardFront";
import "../../../styles/ui/cards/CardPile.scss";
import "../../../styles/ui/cards/CardFront.scss";

interface CardPileProps {
  cards: number[];  // Array of card values
  onCardPlayed: (value: number) => void;
  alt: boolean;
}

const CardPile: React.FC<CardPileProps> = ({ cards, onCardPlayed, alt = false }) => {
  const getLastTwoCards = () => {
    return cards.slice(-2);  // Get the last two cards from the cards array
  };

  const getCardStyle = (index: number) => {
    let angle: number;

    if (cards.length <= 2) {
      // Special case for the first two cards
      angle = index === 0 ? -10 : 10;
    } else {
      // General case for all other cards
      angle = (cards.length - index) % 2 === 0 ? -10 : 10;
    }

    return {
      transform: `translateX(-50%) rotate(${angle}deg)`,
      zIndex: index,
    };
  };

  const lastTwoCards = getLastTwoCards();

  return (
    <div className="card-pile">
      {lastTwoCards.map((value, index) => (
        <div key={index} className="card-position" style={getCardStyle(index)}>
          <CardFront
            value={value}
            onClick={() => onCardPlayed(value)}
            className="card-container-large"
            alt={alt}/>
        </div>
      ))}
    </div>
  );
};

export default CardPile;
