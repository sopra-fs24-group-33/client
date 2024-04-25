import React from 'react';
import { Button } from "./Button";
import PropTypes from "prop-types";
import "../../styles/ui/Ruels.scss";

const rulesText = "De Game is a card game that requires teamwork, good communication\n" +
  "          and reading other people's minds. De Game consists of 99 cards, each\n" +
  "          of which has a number between 1 and 99 on it. In every level, each\n" +
  "          player draws as many cards as the level you are at, so in the first\n" +
  "          level everyone holds one card. The aim is to lay down the cards in\n" +
  "          ascending order without knowing what the other participants hold and\n" +
  "          while not being specific or implying about what number they have on\n" +
  "          their cards. Upon success the group levels up and upon failure the\n" +
  "          level has to be re-done. If two players screw up, they both receive\n" +
  "          a “shame token”. De Game is over as soon as no cards are left on the\n" +
  "          stack, so each card/number is played once."

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