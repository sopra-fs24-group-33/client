import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/PlayerBox.scss"; // Adjust the path to your SCSS file
// @ts-ignore
import shame_logo from "../../assets/tokens/shame_logo.svg";

const PlayerBox = ({ username = "", shameTokens = 0, you = false, clickable = false, onClick = () => {} }) => {

  if (!username) {
    // Render empty player box
    return (
      <div className="player-box empty">
      </div>
    );
  }

  const handleClick = () => {
    if (clickable) {
      onClick();
    }
  };

  return (
    <div className={`player-box box ${you ? "you" : ""} ${clickable ? "clickable" : ""}`} onClick={handleClick}>
      <div className="player-box username">
        <h3>{username}  {you && " (you)"}</h3>
      </div>
      <div className="player-shame-token">
        <div className="shame-token-wrapper">
          <img src={shame_logo} alt="" style={{ width: "25px", height: "25px" }} />
          <h3 className="shame-token-count light">{shameTokens ? shameTokens : 0}</h3>
        </div>
      </div>
    </div>
  );

};

PlayerBox.propTypes = {
  username: PropTypes.string,
  shameTokens: PropTypes.number,
  you: PropTypes.bool, // Corrected the PropTypes type for boolean
  clickable: PropTypes.bool, // Added clickable prop
  onClick: PropTypes.func, // Added onClick prop type
};

export default PlayerBox;
