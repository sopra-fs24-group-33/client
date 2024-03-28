import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/PlayerBox.scss"; // Adjust the path to your SCSS file
import ShameToken from "./ShameToken";

const PlayerBox = ({ username, shameTokens, boxType }) => {
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
          {shameTokens > 0 && (
            <div className="shame-token-wrapper">
              <ShameToken className="shame-token-icon" />
              <span className="shame-token-count">{shameTokens}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
};

PlayerBox.propTypes = {
  username: PropTypes.string,
  shameTokens: PropTypes.number,
  boxType: PropTypes.oneOf(["primary", "secondary", "empty"]), // Include 'empty' as a valid box type
};

export default PlayerBox;
