import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import PlayerBox from  "components/ui/PlayerBox"
import { User } from "types";

const Overview = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>(null);

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

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

  if (users) {
    content = (
      <div className="overview">
        <ul className="overview user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <PlayerBox
                username={user.username}
                shameTokens={69}
                boxType={localStorage.getItem("token") === user.token ? "primary" : "secondary"}
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
        {content}
      </BaseContainer>
      <div className='overview button-container'>
        <Button className="primary-button" width={300} onClick={() => logout()}>
          Create Lobby
        </Button>
        <Button className="primary-button" width={300} onClick={() => logout()}>
          Join Lobby
        </Button>

      </div>
    </div>
  );
};

export default Overview;
