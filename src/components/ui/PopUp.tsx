import React from 'react';
import { Button } from "./Button";
import "../../styles/ui/Button.scss";
import "../../styles/ui/PopUp.scss";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";
// @ts-ignore
import victory_logo from "../../assets/victory_logo.svg";
//import "../../styles/_theme.scss";

interface PopupProps {
  type: 'win' | 'lose' | 'levelUp';
  isVisible: boolean;
  onNext: () => void; // Function to call when closing the popup
  onReveal: () => void;
  onNewGame: () => void;
  onLeaveGame: () => void;
}

const Popup: React.FC<PopupProps> = ({ type, isVisible, onReveal, onNext, onNewGame, onLeaveGame }) => {
  if (!isVisible) {
    return null;
  }

  const headers = {
    win: 'Flawless Victory!',
    end: 'Game Over',
    lose: 'You Lose',
    levelUp: 'Round Won!'
  };

  const messages = {
    win: 'Be proud of yourself. You mastered De Game!',
    end: 'No more cards left!',
    lose: 'You have to restart this level.',
    levelUp: 'You\'ve reached the next level!'
  };

  const actions = {
    win: [
      { label: 'New Game', action: onNewGame },
      { label: 'Leave', action: onLeaveGame }
    ],
    end: [
      { label: 'New Game', action: onNewGame},
      { label: 'Leave', action: onLeaveGame}
    ],
    lose: [
      { label: 'Reveal Cards', action: onReveal }
    ],
    levelUp: [
      { label: 'Next Level', action: onNext }
    ]
  };

  const borderStyle = {
    border: type === 'lose'
      ? '1px solid #fc3a87'
      : '1px solid #8F5BFF',
  };



  return (
    <div className="module" style={borderStyle}>
      <div className="shamelogo-carrier">
        <img src={type === 'lose' ? shame_logo : victory_logo}
             alt=""
             style={{ width: "100px", height: "100px" }}/>
      </div>

      <h2>{headers[type]}</h2>
      <p>{messages[type]}</p>
      <div>
        {actions[type].map((button, index) => (
          <Button key={index} onClick={button.action} style={{ margin: "5px" }}>
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Popup;
