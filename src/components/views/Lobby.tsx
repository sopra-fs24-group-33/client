import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import GameLobby from "models/Lobby";
import {useNavigate} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import Header from "./Header";
import { Spinner } from "../ui/Spinner";
import PlayerBox from "../ui/PlayerBox";
import { Player } from "../../types";
import "styles/views/Lobby.scss";


const Lobby = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>(null);
  const [lobby, setLobby] = useState<GameLobby>(null);

  const leaveLobby = async () => {
    console.log("player id:", typeof players[0].id)
    console.log("local storage id:", typeof localStorage.getItem("id"))
    const player = players.find(player => player.id.toString() === localStorage.getItem("id"))
    const lobbyPin = localStorage.getItem("pin")

    console.log("lobby Pin:",lobbyPin)

    console.log(player)

    navigate("/overview")

    try {
      const requestBody = JSON.stringify( player )
      const response = await api.put(`/gamelobbys/${lobbyPin}`, requestBody)
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



  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      const lobbyPin = localStorage.getItem("pin")
      try {
        console.log("lobby id:", lobbyPin)
        const requestBody = JSON.stringify( lobbyPin )
        const response = await api.get(`/gamelobbys/${lobbyPin}`, requestBody);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLobby(response.data);
        // Get the returned users and update the state.
        setPlayers(response.data.players);


        // Get current user based on token

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

  let content = <Spinner />
  let displayPin = null

  if (players) {
  content = (
    <div className="overview">
      <ul className="overview user-list">
        {players.map((player: Player) => (
          <li key={player.id}>
            <PlayerBox
              username={player.guestname}
              shameTokens={player.shame_tokens}
              boxType={localStorage.getItem("id") === player.id.toString() ? "primary" : "secondary"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
  if (lobby) {
    const stringPin = lobby.pin.toString();
    displayPin = stringPin.substring(0, 3) + " " + stringPin.substr(3);
  }
  return (
    <div>
      <BaseContainer className="lobby container">
        <h2>Game Pin</h2>
        <h1> {displayPin} </h1>
        <hr className="lobby hr-thin" />
        <div className="lobby player-container">
          {content}
        </div>
      </BaseContainer>
      <div className="lobby button-container">
        <Button className="primary-button" width={300} >
          Start Game
        </Button>
        <Button className="primary-button" width={300} onClick={() => leaveLobby()}>
          Leave Lobby
        </Button>

      </div>
    </div>
  );
}
export default Lobby;