import React from 'react';
import { Button } from "./Button";

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

  const messages = {
    win: 'Flawless Victory!',
    end: 'Game Over. No more cards left!',
    lose: 'Round Lost.',
    levelUp: 'Round Won! You\'ve reached the next level!'
  };

  const actions = {
    win: [
      { label: 'New Game', action: onNewGame },
      { label: 'Leave', action: onLeaveGame }
    ],
    lose: [
      { label: 'Reveal Cards', action: onReveal }
    ],
    levelUp: [
      { label: 'Next Level', action: onNext }
    ]
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      padding: '20px',
      backgroundColor: 'black',
      border: '1px solid black',
      borderRadius: '1vw',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
      textAlign: 'center'
    }}>
      <h2>{messages[type]}</h2>
      <div>
        {actions[type].map((button, index) => (
          <Button key={index} onClick={button.action} style={{ margin: '5px' }}>
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Popup;
