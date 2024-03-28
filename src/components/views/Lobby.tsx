import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import Header from "./Header";
import { Spinner } from "../ui/Spinner";
import PlayerBox from "../ui/PlayerBox";


const Lobby = () => {
  const [users, setUsers] = useState<User[]>(null);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/lobbies/`);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

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


  const content = (
    <div className="overview">
      <ul className="overview user-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <PlayerBox
              username={index === 0 ? "ses" : index === 1 ? "lol" : ""}
              shameTokens={index === 0 ? 69 : index === 1 ? 5 : 0}
              boxType={index === 0 ? "primary" : index === 1 ? "secondary" : "empty"}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <BaseContainer className="overview container">
        <h2>Game Pin</h2>
        <h1> 123 456</h1>
        <hr className="overview hr-thin" />
        <div className="overview player-container">
          {content}
        </div>
      </BaseContainer>
      <div className="overview button-container">
        <Button className="primary-button" width={300} >
          Start Game
        </Button>
        <Button className="primary-button" width={300} >
          Leave Lobby
        </Button>

      </div>
    </div>
  );
}
export default Lobby;