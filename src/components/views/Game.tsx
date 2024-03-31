import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User, Guest } from "types";

const Player = ({ user }: { user: Guest }) => (
  <div className="player container">
    {user.guestname} {user.id} {user.isUser} {user.status}
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const id = localStorage.getItem("token")
  const logout = async () => {
    console.log(localStorage.getItem("token"));
    await api.delete(`/guests/${id}`)
    localStorage.removeItem("token");
    if (id === null)  {
      navigate("/login");
    }
    navigate("/login")
  };

  const openProfil = async (id) => {
    navigate(`/game/userprofile/${id}`);
  };

  const doLobby = async () => {
    const id = localStorage.getItem("token");

    // Retrieve admin user data from the API
    const adminResponse = await api.get(`/guests/${id}`);
    const user = adminResponse.data;
    console.log("Original User:", user);

    // Create user2 object with an incremented ID
    const user2 = { ...user, id: user.id + 1 };
    console.log("Modified User (user2):", user2);

    // Create game lobby using admin user's data
    const lobbyResponse = await api.post("/gamelobbys", user);
    const gamelobby = lobbyResponse.data;
    const lobbyid = gamelobby.id;

    // Update the game lobby with modified user2 data
    const response = await api.post(`/gamelobbys/${lobbyid}`, user2);
    console.log("Updated Game Lobby:", response.data);

    const responseleft = await api.get(`/gamelobbys/${lobbyid}`);
    console.log(responseleft.data)
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/guests");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUsers(response.data);
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

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: Guest) => (
            <li key={user.id}>
              <Button width="100%" onClick={() => openProfil(user.id)}>
                <Player user={user} />
              </Button>
            </li>
          ))}
        </ul>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
        <Button
          width="100%"
          onClick={() => doLobby()}
        >
          create Lobby
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Happy Coding!</h2>
      <p className="game paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
};

export default Game;
