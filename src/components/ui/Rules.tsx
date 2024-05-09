import React from 'react';
import { Button } from "./Button";
import PropTypes from "prop-types";
import "../../styles/ui/Rules.scss";

const rulesText = "De Game is a cooperative card game that tests teamwork, good communication\n" +
  "          and intuition.\n" +
  "          and intuition.\n" +
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
      <div className="modal-rules" >
        <h2 style={{
          marginBottom: "1px",
        }}>Game Rules</h2>
        <hr className="rules divider"/>
        <div className="game-rules">
          <p style={{
            fontSize: "16px",
          }}>De Game is a cooperative card game that tests teamwork, good communication, and
            intuition.</p>

          <h3>Objective</h3>
          <ul>
            <li>Place the cards drawn from the deck in ascending numerical order across various levels.</li>
          </ul>

          <h3>Setup</h3>
          <ul>
            <li>2-5 Players</li>
            <li>Deck consists of 99 cards numbered from 1 to 99</li>
            <li>Shuffle the deck</li>
            <li>Start from Level 1</li>
          </ul>

          <h3>Gameplay</h3>
          <ol>
            <li><strong>Drawing Cards:</strong> At the start of each level, players draw a number of cards equal to the
              level (e.g., draw 2 cards in Level 2)
            </li>
            <li><strong>Playing Cards:</strong> Players aim to play their cards in ascending order</li>
            <li><strong>Progression:</strong> Successfully arranging all drawn cards in ascending order allows the team
              to get to the next level
            </li>
            <li><strong>Mistakes:</strong> If a card is played out of order, the player receives a shame token, and the
              round restarts at the current level with the same number of cards
            </li>
            <li><strong>Communication Limits:</strong> The key challenge in De Game is to find ways to communicate their
              cards without stating the specific number
            </li>
          </ol>

          <h3>End of Game</h3>
          <p style={{
            fontSize: "16px",
          }}>The game concludes when there are no remaining cards in the deck. The team’s performance can be evaluated
            based on the number of levels completed and shame tokens collected.</p>
        </div>

        <Button onClick={onClose}>Got it</Button>
      </div>
    </div>
  );
};

Rules.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Rules;