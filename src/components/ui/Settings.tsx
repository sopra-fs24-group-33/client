import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import "../../styles/ui/Join.scss";
import "../../styles/ui/Settings.scss";
import "../../styles/views/Overview.scss";
import { Button } from "../ui/Button";
import { ToggleButton } from "./ToggleButton";
import { ChromePicker } from 'react-color'; // Import the ChromePicker

interface SettingsProps {
  onClose: () => void;
  onCardStyle: () => void;
  onHelp: () => void;
  onWinColorChange: (color: string) => void;
  onLoseColorChange: (color: string) => void;
  altStyle: boolean;
  help: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onCardStyle, onHelp, onWinColorChange, onLoseColorChange, altStyle, help }) => {
  const defaultWinColor = "#8F5BFFFF";  // Default win color
  const defaultLoseColor = "#FC3A87FF";  // Default lose color

  const [winColor, setWinColor] = useState(() => localStorage.getItem('winColor') || defaultWinColor);
  const [loseColor, setLoseColor] = useState(() => localStorage.getItem('loseColor') || defaultLoseColor);
  const [displayWinColorPicker, setDisplayWinColorPicker] = useState(false);
  const [displayLoseColorPicker, setDisplayLoseColorPicker] = useState(false);

  const handleWinColorChange = (color) => {
    setWinColor(color.hex);
    onWinColorChange(color.hex);
    localStorage.setItem("winColor", color.hex); // Save to localStorage
  };

  const handleLoseColorChange = (color) => {
    setLoseColor(color.hex);
    onLoseColorChange(color.hex);
    localStorage.setItem("loseColor", color.hex); // Save to localStorage
  };

  const resetWinColor = () => {
    setWinColor(defaultWinColor);
    onWinColorChange(defaultWinColor);
    localStorage.setItem("winColor", defaultWinColor); // Save to localStorage
  };

  const resetLoseColor = () => {
    setLoseColor(defaultLoseColor);
    onLoseColorChange(defaultLoseColor);
    localStorage.setItem("loseColor", defaultLoseColor); // Save to localStorage
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--win-color', winColor);
    document.documentElement.style.setProperty('--lose-color', loseColor);
  }, [winColor, loseColor]);

  return (
    <div className="backdrop-settings">
      <div className="modal-settings">
        <h2>Settings</h2>
        <hr className="divider" />
        <div className="button-settings">
          <div className="settings-box">
            <p>card style</p>
            <div className="toggle-wrapper">
              <ToggleButton size="default" option1="Default" option2="Alternative" onToggle={onCardStyle} defaultToggled={altStyle} />
            </div>
          </div>
          <div className="settings-box">
            <p>win animation</p>
            <div className="color-picker-wrapper">
              <div
                className="color-box"
                style={{ backgroundColor: winColor }}
                onClick={() => setDisplayWinColorPicker(!displayWinColorPicker)}
              ></div>
              {displayWinColorPicker && (
                <div className="popover">
                  <div className="cover" onClick={() => setDisplayWinColorPicker(false)} />
                  <ChromePicker color={winColor} onChange={handleWinColorChange} />
                </div>
              )}
              <button className="reset-button" onClick={resetWinColor}>Reset</button>
            </div>
          </div>
          <div className="settings-box">
            <p>lose animation</p>
            <div className="color-picker-wrapper">
              <div
                className="color-box"
                style={{ backgroundColor: loseColor }}
                onClick={() => setDisplayLoseColorPicker(!displayLoseColorPicker)}
              ></div>
              {displayLoseColorPicker && (
                <div className="popover">
                  <div className="cover" onClick={() => setDisplayLoseColorPicker(false)} />
                  <ChromePicker color={loseColor} onChange={handleLoseColorChange} />
                </div>
              )}
              <button className="reset-button" onClick={resetLoseColor}>Reset</button>
            </div>
          </div>
          <div className="settings-box">
            <p>show lowest card</p>
            <div className="toggle-wrapper">
              <ToggleButton size="small" option1="Yes" option2="No" onToggle={onHelp} defaultToggled={!help} />
            </div>
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCardStyle: PropTypes.func.isRequired,
  onHelp: PropTypes.func.isRequired,
  onWinColorChange: PropTypes.func.isRequired,
  onLoseColorChange: PropTypes.func.isRequired,
  altStyle: PropTypes.bool.isRequired,
  help: PropTypes.bool.isRequired,
};

export default Settings;
