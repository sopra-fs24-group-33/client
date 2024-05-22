import React from "react";
// @ts-ignore
import cardBackImage from "../../../assets/cards/Card Backside.svg"; // Adjust the path as necessary
import "../../../styles/ui/Deck.scss";

interface DeckProps {
  numCards: number,
  width: string,
}

const Deck: React.FC<DeckProps> = ({ numCards = 100, width = "6vw" }) => {
  const numPiles = Math.ceil(numCards / 10);
  const generateCards = () => {
    const cards = [];
    for (let i = 0; i < numPiles; i++) {
      let cardStyle = { marginLeft: `${i * -2}px`, marginTop: `${i * -2}px` };
      cards.push(
        <div className="card" key={i} style={cardStyle}>
          <img
            style={{ width: width }}
            src={cardBackImage}
            alt="Card Back"
          />
        </div>
      );
    }
    return cards;
  };

  return (
    <div className="deck">
      <div className="pile">
        {generateCards()}
      </div>
    </div>
  );
};


export default Deck;

