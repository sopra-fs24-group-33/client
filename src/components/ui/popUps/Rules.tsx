import React from 'react';
import { Button } from "../Button";
import PropTypes from "prop-types";
import "../../../styles/ui/Rules.scss";

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
          }}>De Game is a cooperative card game that promotes teamwork, good communication, and
            intuition.</p>

          <h3>Objective</h3>
          <ul>
            <li>Place the cards drawn from the deck in ascending numerical order across various levels</li>
            <li>Play through all the whole card stack (99 cards)</li>
          </ul>

          <h3>Setup</h3>
          <ul>
            <li>2-5 Players</li>
            <li>Deck consists of 99 cards numbered from 1 to 99</li>
            <li>Shuffle the deck</li>
            <li>Start at Level 1</li>
          </ul>

          <h3>Gameplay</h3>
          <ol>
            <li><strong>Drawing Cards:</strong> At the start of each level, players draw the number of cards equal to the
              level (e.g., draw 2 cards in Level 2)
            </li>
            <li><strong>Playing Cards:</strong> The aim is to play the cards in ascending order</li>
            <li><strong>Progression:</strong> Successfully laying down all drawn cards in ascending order allows the team
              to get to the next level
            </li>
            <li><strong>Mistakes:</strong> If a card is played out of order, the player that played the wrong card and the player that should have played the card receive shame tokens, 
              and new cards are distributed (level and number of cards stay the same)
            </li>
            <li><strong>Communication Limits:</strong> The key challenge of De Game is to find ways to communicate their
              cards without stating or implying the specific number
            </li>
          </ol>

          <h3>End of Game</h3>
          <p style={{
            fontSize: "16px",
          }}>The game ends when there are no remaining cards in the deck. The team’s performance can be evaluated
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