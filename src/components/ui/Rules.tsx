import React from 'react';
import { Button } from "./Button";
import PropTypes from "prop-types";
import "../../styles/ui/Rules.scss";

const rulesText = "De Game is a card game that requires teamwork, good communication\n" +
  "          and reading other people's minds. A deck consists of 99 cards, each with\n" +
  "          a number ranging from 1 to 99. In every level, each\n" +
  "          player draws as many cards as the current level suggests, so in the first\n" +
  "          level everyone holds one card. The aim is to play the cards in\n" +
  "          correct ascending order. The players don't know what the other participants hold in their hands\n" +
  "          and my not be specific about what number they have. \n" +
  "          Upon success the hole group levels up and upon failure the\n" +
  "          level has to be replayed. If two players screw up, they both get\n" +
  "          a “shame token”. De Game is over as soon as no cards are left on the\n" +
  "          stack, so each card is played once."

const Rules = ({ onClose }) => {
  return (
    <div className="backdrop" >
      <div className="modal" >
        <h2>Game Rules</h2>
        <hr className="rules divider"/>
        <p className="rules text">{rulesText}</p>
        <Button onClick={onClose}>Got it</Button>
      </div>
    </div>
  );
};

Rules.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Rules;