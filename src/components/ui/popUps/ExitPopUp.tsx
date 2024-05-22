import React from 'react';
import { Button } from "../Button";
import PropTypes from "prop-types";
import "../../../styles/ui/popUps/Settings.scss";

const ExitPopUp = ({ onCancel, onConfirm }) => {
  return (
    <div className="backdrop" >
      <div className="modal-settings">
        <h2 style={{
          marginBottom: "1px",
        }}>End Game?</h2>
        <hr className="divider-exit" />
        <p style={{
          marginBottom: "0px"
        }}> Leaving the game results in ending the game for all.</p>
        <p style={{
          marginTop: "4px"
        }}> Any shame tokens earned up to that point will remain.</p>
        <div className="button-wrapper-exit">
          <Button className="outlined" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Leave</Button>
        </div>
      </div>
    </div>
  );
};

ExitPopUp.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ExitPopUp;