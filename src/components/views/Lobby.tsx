import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import GameLobby from "models/Lobby";
import {useNavigate} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import Header from "./Header";
import { Spinner } from "../ui/Spinner";
import OldPlayerBox from "../ui/old-PlayerBox";
import { Player } from "../../types";
import "styles/views/Lobby.scss";
import PlayerBox from "../ui/PlayerBox";


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
      const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
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
      const pin = localStorage.getItem("pin")
      try {
        const requestBody = JSON.stringify(pin)
        const response = await api.get(`/gamelobbies/${pin}`, requestBody);
        console.log("This is the response data: ",  response.data)

        setLobby(response.data);
        setPlayers(response.data.players);




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
  let  displayPin = null

  if (players) {
  content = (
    <div className="overview">
      <ul className="overview user-list">
        {players.map((player: Player) => (
          <li key={player.id}>
            <PlayerBox
              username={player.name}
              shameTokens={player.shame_tokens}
              you={localStorage.getItem("id") === player.id.toString()}
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
  /*
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

   */

  return (
    <div className="lobby section">
      <BaseContainer className="lobby container">
        <h2 className="lobby header">Game Pin: {displayPin}</h2>
        <hr className="lobby hr-thin" />
        <div className="lobby player-container">
          {content}
        </div>
        <div className="lobby button-container">
          <Button className="outlined" width="100%" onClick={() => leaveLobby()}>
            Leave Lobby
          </Button>
          <Button className="" width="100%" >
            Start Game
          </Button>
        </div>
      </BaseContainer>


    </div>
  )
}
export default Lobby;