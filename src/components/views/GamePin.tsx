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
import { Player } from "../../types";

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

const FormFieldPin = (props) => {
  const handleInputChange = (e) => {
    // Remove non-numeric characters and limit the length to 6
    let inputValue = e.target.value.replace(/\D/g, '').substring(0, 6);
    // Insert a space after the third character for visual representation
    let formattedValue = inputValue.replace(/(\d{3})(?=\d)/g, '$1 ');
    // Update the state with the formatted input for visual representation
    props.onChange(formattedValue);
  };

  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value} // Use value for visual representation
        onChange={handleInputChange}
      />
    </div>
  );
};

FormFieldPin.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const GamePin = () => {
  const navigate = useNavigate();
  const [gamePin, setGamePin] = useState<number>(null);
  const userId = localStorage.getItem("id");

  const [players, setPlayers] = useState<Player[]>(null);

  const doJoin = async () => {
    const player = players.find(user => user.token === localStorage.getItem("token"));

    console.log("Player:", player)
    console.log("Game Pin:", typeof gamePin)

    const withoutSpacing = gamePin.replace(/\s/g, '')
    const finalPin = parseInt(withoutSpacing, 10);

    console.log("Game Pin Final:",  finalPin)

    try {
      const requestBody = JSON.stringify( player )
      const response = await api.post(`/gamelobbies/${finalPin}`, requestBody)

      localStorage.setItem("pin", withoutSpacing);

      navigate("/lobby")
    } catch (error) {
      alert (
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/players");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setPlayers(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login pin-form">
          <h2>Enter Game Pin</h2>
          <FormFieldPin
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