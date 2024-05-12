import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import "../../styles/ui/Join.scss";
import "../../styles/ui/DrawPopUp.scss";
import "../../styles/views/Overview.scss";
import { Button } from "../ui/Button";
import Deck from "./cards/Deck";  // Ensure this path is correct and styles are appropriate for the popup

interface SettingsProps {
  onClose: () => void;
  onCardStyle: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onCardStyle }) => {

  return (
    <div className="backdrop-draw">
      <div className="modal-draw">
        <div className="button-draw">
          <Button width="10vw" onClick={onCardStyle}>
            Change Card Style
          </Button>
        </div>
      </div>
    </div>
  );
};

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCardStyle: PropTypes.func.isRequired,
};

export default Settings;
