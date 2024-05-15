import React from "react";
import PropTypes from "prop-types";
import CardFront from "./CardFront";
import "../../../styles/ui/PlayerHand.scss"; // make sure to have the path correct

interface PlayerHandProps {
  cardValues: number[]; // Defining the type for the cardValues prop
  alt: boolean;
  help: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cardValues, onClick, alt = false, help= true }) => {
  // Determine the minimum value in cardValues if help is true
  const minValue = help ? Math.min(...cardValues) : null;

  return (
    <div className="player-hand">
      {cardValues.map((value, index) => {
        // Conditionally set the className based on whether the value is the minimum and help is true
        const className = help && value === minValue ? "card-container lowest" : "card-container";
        return (
          <CardFront
            key={index}
            value={value}
            onClick={onClick}
            className={className}
            alt={alt}
          />
        );
      })}
    </div>
  );
};

// PropTypes is a runtime mechanism for React and you are using TypeScript here, so you can omit this part.
// But if you want to keep it, it doesn't hurt but is not necessary with TypeScript.
PlayerHand.propTypes = {
  cardValues: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
  alt: PropTypes.number,
};

export default PlayerHand;
