import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/PlayerBox.scss"; // Adjust the path to your SCSS file
import ShameToken from "./ShameToken";

const PlayerBox = ({ username, shameTokens, boxType }) => {

  return (
    <div className={`player-box ${boxType}`}>
      <div className="player-box username">
        {username}
      </div>
      <div className="player-shame-token">
        <ShameToken className="shame-token-icon" />
        <span className="shame-token-count">{shameTokens}</span>
      </div>
    </div>
  );
};

PlayerBox.propTypes = {
  username: PropTypes.string,
  shameTokens: PropTypes.number,
  boxType: PropTypes.oneOf(["primary", "secondary"]), // Define valid box types
};

export default PlayerBox;
