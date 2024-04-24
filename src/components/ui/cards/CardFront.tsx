// CardFront.tsx
import React from "react";
import "../../../styles/ui/CardFront.scss";
// @ts-ignore
import cardFront from "../../../assets/cards/Card Frontside.svg";
import { colorForValue } from "../../../helpers/calculateColor.js";

interface CardFrontProps {
  value: number;
  onClick: (value:number) => void;
  className?: string;
}

const CardFront: React.FC<CardFrontProps> = ({ value, onClick, className }) => {
  const valueColor = colorForValue(value);
  const handleClick = () => {
    if (className == "card-container") // only for player hand
    onClick(value);
  }

  return (
    <div className={className} onClick={handleClick}>
      <img src={cardFront} alt={`Card value: ${value}`} className="card-img" />
      <div className="card-value" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
};

export default CardFront;
