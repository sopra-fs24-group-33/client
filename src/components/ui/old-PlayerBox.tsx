import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/old-PlayerBox.scss"; // Adjust the path to your SCSS file
import ShameToken from "./ShameToken";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";

const OldPlayerBox = ({ username, shameTokens, boxType }) => {
  if (boxType === "empty") {
    // Render the box for the 'empty' state
    return (
      <div className="player-box empty">
        <div className="player-box add-symbol">+</div>
      </div>
    );
  } else {
    // Render the regular player box
    return (
      <div className={`player-box ${boxType}`}>
        <div className="player-box username">
          {username}
        </div>
        <div className="player-shame-token">
          <div className="shame-token-wrapper">
            <span className="shame-token-count">{shameTokens}</span>
            <img src={shame_logo} alt="" style={{}} />
          </div>
        </div>
      </div>
    );
  }
};

OldPlayerBox.propTypes = {
  username: PropTypes.string,
  shameTokens: PropTypes.number,
  boxType: PropTypes.oneOf(["primary", "secondary", "empty"]), // Include 'empty' as a valid box type
};

export default OldPlayerBox;
