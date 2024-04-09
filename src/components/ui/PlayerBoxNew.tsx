import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/PlayerBoxNew.scss"; // Adjust the path to your SCSS file
import ShameToken from "./ShameToken";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";

const PlayerBoxNew = ({ username, shameTokens, you }) => {

  return (
    <div className={`player-box box`}>
      <div className="player-box username">
        <h3>{username}  {you && " (you)"}</h3>


      </div>
      <div className="player-shame-token">
        <div className="shame-token-wrapper">
          <img src={shame_logo} alt="" style={{}} />
          <span className="shame-token-count">{shameTokens}</span>
        </div>
      </div>
    </div>
  );

};

PlayerBoxNew.propTypes = {
  username: PropTypes.string,
  shameTokens: PropTypes.number,
  you: PropTypes.boolean,
};

export default PlayerBoxNew;
