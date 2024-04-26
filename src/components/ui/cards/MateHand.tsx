import React from "react";
// @ts-ignore
import cardBackImage from "../../../assets/cards/Card Backside.svg"; // Adjust the path as necessary
import CardFront from "./CardFront";
import "../../../styles/ui/cards/MateHand.scss";

interface CardBackRowProps {
  cardValues: number[];  // Number of card backs to display
  revealCards: boolean; // Whether to show the card front or back
}

const MateHand: React.FC<CardBackRowProps> = ({ cardValues, revealCards }) => {
  if (revealCards && cardValues.length) {
    // Show card fronts when revealCards is true and cardValues are provided
    // @ts-ignore
    return (
      <div className="player-hand">
        {cardValues.map((value, index) => (
          <CardFront key={index} value={value} className="card-container-small"/>
        ))}
      </div>
    );
  } else {
    return (
      <div className="card-back-row">
        {Array.from({ length: cardValues.length }, (_, index) => (
          <img key={index} src={cardBackImage} alt="Card Back" className="card-back-img" />
        ))}
      </div>
    );
  }
};

export default MateHand;
