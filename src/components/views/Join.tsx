import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import "../../styles/views/Login.scss";
import "../../styles/ui/Join.scss";
import "../../styles/views/Overview.scss";
import { Button } from "../ui/Button";  // Ensure this path is correct and styles are appropriate for the popup

const FormFieldPin = ({ label, value, onChange, onKeyDown}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Automatically focus the input field when the component is mounted
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '').substring(0, 6);
    let formattedValue = inputValue.replace(/(\d{3})(?=\d)/g, '$1 ');
    onChange(formattedValue);
  };

  return (
    <div className="login field" style={{
      width:"40%"
    }} >
      <label className="login label">{label}</label>
      <input
        className="join input"
        ref={inputRef}
        placeholder="123 456"
        value={value}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

FormFieldPin.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

interface JoinPopupProps {
  onClose: () => void;
  onJoin: (pin: string) => void;
}

const JoinPopup: React.FC<JoinPopupProps> = ({ onClose, onJoin, error }) => {
  const [pin, setPin] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onJoin(pin);
    } else if (event.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div className="backdrop">
      <div className="modal-rules">
        <h2 style={{
          marginBottom: "0.2em",
        }}>Enter Pin</h2>
        <hr className="join divider" />
        <FormFieldPin
          label=""
          value={pin}
          onChange={setPin}
          onKeyDown={handleKeyDown}
        />
        <div style={{ color: "#fc3a87", height: "1em", fontSize: "1em" }}>{error}</div>
        <div className="overview button-container">
          <Button className= "outlined" width="7vw" onClick={onClose}>Cancel</Button>
          <Button width="7vw" onClick={() => onJoin(pin)}>Join</Button>
        </div>
      </div>
    </div>
  );
};

JoinPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default JoinPopup;
