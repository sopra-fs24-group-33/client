import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import PlayerBox from  "components/ui/PlayerBox"
import { Player } from "types";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import Lobby from "models/Lobby";

const Overview = () => {

  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>(null);
  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const logout = async () => {
    const id = localStorage.getItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    await api.delete(`/players/${id}`)
    navigate("/login");
  };

  const createLobby = async () => {

    // Get current player based on token
    const player = players.find(user => user.token === localStorage.getItem("token"))

    try {
      const requestBody = JSON.stringify( player )
      const response = await api.post("/gamelobbies", requestBody);

      console.log("response data:", response.data)

      const lobby = new Lobby(response.data)

      console.log("pin:", lobby.pin)
      console.log("admin:", lobby.admin)
      console.log("players:", lobby.players)

      localStorage.setItem("leader", player.token)
      localStorage.setItem("pin", lobby.pin)

      navigate("/lobby");
    }
    catch (error) {
      alert(
        `Something went wrong during the lobby creation: \n${handleError(error)}`
      )

    }
  }

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

  let content = <Spinner />

  if (players) {
    content = (
      <div className="overview">
        <ul className="overview user-list">
          {players.map((player: Player) => (
            <li key={player.id}>
              <PlayerBox
                username={player.name}
                shameTokens={player.shame_tokens}
                boxType={localStorage.getItem("token") === player.token ? "primary" : "secondary"}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <BaseContainer className="overview container">
        <h2>Players Online</h2>
        <hr className="overview hr-thin" />
        <div className="overview player-container">
          {content}
        </div>
      </BaseContainer>
      <div className='overview button-container'>
        <Button className="primary-button" width={300} onClick={() => createLobby()}>
          Create Lobby
        </Button>
        <Button className="primary-button" width={300} onClick={() => navigate("/join")}>
          Join Lobby
        </Button>

      </div>
      <Button width="100%" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
};

export default Overview;
