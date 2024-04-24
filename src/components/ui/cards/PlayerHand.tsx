import React from "react";
import PropTypes from "prop-types";
import CardFront from "./CardFront";
import "../../../styles/ui/PlayerHand.scss"; // make sure to have the path correct

interface PlayerHandProps {
  cardValues: number[]; // Defining the type for the cardValues prop
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cardValues, onClick }) => {
  return (
    <div className="player-hand">
      {cardValues.map((value, index) => (
        // The key prop is correctly used here for React's internal use and does not need to be declared in CardFront's propTypes.
        <CardFront key={index} value={value} onClick={onClick} className="card-container" />
      ))}
    </div>
  );
};

// PropTypes is a runtime mechanism for React and you are using TypeScript here, so you can omit this part.
// But if you want to keep it, it doesn't hurt but is not necessary with TypeScript.
PlayerHand.propTypes = {
  cardValues: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
};

export default PlayerHand;
