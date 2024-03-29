import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Form, useNavigate } from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import Header from "./Header";
import { Spinner } from "../ui/Spinner";
import PlayerBox from "../ui/PlayerBox";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const GamePin = () => {
  const navigate = useNavigate();
  const [gamePin, setGamePin] = useState<number>(null);
  const userId = localStorage.getItem("id");

  const doJoin = async () => {
    try {
      const requestBody = JSON.stringify( {gamePin, userId} )
      const response = await api.post("/lobbies")

      localStorage.setItem("gamePin", gamePin);

      navigate("/lobby")
    } catch (error) {
      alert (
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login pin-form">
          <h2>Enter Game Pin</h2>
          <FormField
            value={gamePin}
            onChange={(pin: number) => setGamePin(pin)}
          />
          <div className="overview button-container">
            <Button className="primary-button" width={100} onClick={() => doJoin()}>
              Continue
            </Button>
            <Button className="primary-button" width={100} onClick={() => navigate("/overview")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  )
}
export default GamePin;