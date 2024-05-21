import React from 'react';
import { Button } from "../Button";
import "../../../styles/ui/Button.scss";
import "../../../styles/ui/PopUp.scss";
// @ts-ignore
import shame_logo from "../../../assets/tokens/shame_logo.svg";
// @ts-ignore
import victory_logo from "../../../assets/tokens/victory_logo.svg";
// @ts-ignore
import champion_logo from "../../../assets/tokens/champion_logo.svg";

interface PopupProps {
  type: 'win' | 'lose' | 'levelUp' | 'end';
  isVisible: boolean;
  onNext: () => void; // Function to call when closing the popup
  onReveal: () => void;
  onNewGame: () => void;
  onLeaveGame: () => void;
  isAdmin: boolean;
}

const Popup: React.FC<PopupProps> = ({ type, isVisible, onReveal, onNext, onNewGame, onLeaveGame, isAdmin }) => {
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

  // Determine actions based on isAdmin status
  const adminActions = {
    win: [
      { label: 'Back to Lobby', action: onNewGame }
    ],
    end: [
      { label: 'Back to Lobby', action: onNewGame }
    ]
  };

  const userActions = {
    win: [
      { label: 'Back to Lobby', action: onNewGame },
      { label: 'Leave Game', action: onLeaveGame }
    ],
    end: [
      { label: 'Back to Lobby', action: onNewGame },
      { label: 'Leave Game', action: onLeaveGame }
    ]
  };

  const actions = isAdmin ? adminActions : userActions;

  const allActions = {
    ...actions,
    lose: [
      { label: 'Reveal Cards', action: onReveal }
    ],
    levelUp: [
      { label: 'Next Level', action: onNext }
    ]
  };

  // Define border style based on type
  const borderStyle = {
    border:
      type === 'lose'
        ? '1px solid #fc3a87'
        : type === 'levelUp'
          ? '1px solid #8F5BFF'
          : type === 'win'
            ? '1px solid gold'
            : '1px solid $grey', // Default to grey for 'end'
  };

  // Select the appropriate logo based on the type
  const getLogo = (type: string) => {
    switch (type) {
      case 'lose':
        return shame_logo;
      case 'levelUp':
        return victory_logo;
      case 'win':
        return champion_logo;
      default:
        return null;
    }
  };

  return (
    <div className="module" style={borderStyle}>
      <div className="shamelogo-carrier">
        {getLogo(type) && (
          <img src={getLogo(type)}
               alt=""
               style={{ width: "100px", height: "100px" }} />
        )}
      </div>

      <h2>{headers[type]}</h2>
      <p>{messages[type]}</p>
      <div>
        {allActions[type].map((button, index) => (
          <Button key={index} onClick={button.action} style={{ margin: "5px" }}>
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Popup;
