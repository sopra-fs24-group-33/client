// CardFront.tsx
import React from "react";
import "../../../styles/ui/CardFront.scss";
// @ts-ignore
import cardFront from "../../../assets/cards/Card Frontside.svg";
// @ts-ignore
import cardFront1 from "../../../assets/cards/Card Frontside1.svg";
// @ts-ignore
import cardFront99 from "../../../assets/cards/Card Frontside99.svg";
// @ts-ignore
import cardFrontAlt from "../../../assets/cards/Card Frontside Alt.svg";
import { colorForValue } from "../../../helpers/calculateColor.js";

interface CardFrontProps {
  value: number;
  onClick: (value:number) => void;
  className?: string;
  alt: false;
}

const CardFront: React.FC<CardFrontProps> = ({ value, onClick, className, alt = true }) => {
  const valueColor = colorForValue(value);
  let srcImage;
  const handleClick = () => {
    if (className == "card-container") // only for player hand
    onClick(value);
  }

  if (alt) {
    srcImage = cardFrontAlt;

    return (
      <div style={{
        backgroundColor: valueColor,
      }} className={className} onClick={handleClick}>
        <img src={srcImage} alt={`Card value: ${value}`} className="card-img" />
        <div className="card-value">
          {value}
        </div>
      </div>
    );
  } else {
    if (value === 1) {
      srcImage = cardFront1;
    } else if (value === 99) {
      srcImage = cardFront99;
    } else {
      srcImage = cardFront;
    }

    return (
      <div className={className} onClick={handleClick}>
      <img src={srcImage} alt={`Card value: ${value}`} className="card-img" />
        <div className="card-value" style={{ color: valueColor }}>
          {value}
        </div>
      </div>
    );
  }
};

export default CardFront;
