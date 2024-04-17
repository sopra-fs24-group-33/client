import React from "react";
// @ts-ignore
import cardBackImage from "../../../assets/cards/Card Backside.svg"; // Adjust the path as necessary
import "../../../styles/ui/MateHand.scss";

interface CardBackRowProps {
  count: number;  // Number of card backs to display
}

const MateHand: React.FC<CardBackRowProps> = ({ count }) => {
  return (
    <div className="card-back-row">
      {Array.from({ length: count }, (_, index) => (
        <img key={index} src={cardBackImage} alt="Card Back" className="card-back-img" />
      ))}
    </div>
  );
};

export default MateHand;
