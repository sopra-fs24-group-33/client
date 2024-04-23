import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import PlayerBox from "components/ui/PlayerBox";
import { Player, User } from "types";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import Lobby from "models/Lobby";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";
import "../../styles/ui/PlayerBox.scss";
import "../../styles/_theme.scss";


const Overview = () => {

  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>(null);
  const [users, setUsers] = useState<User[]>(null);
  const [curPlayer, setCurPlayer] = useState<Player>(null);

  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const logout = async () => {
    const id = localStorage.getItem("id");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    await api.delete(`/players/${id}`)
    navigate("/home");
  };


  const createLobby = async () => {
    // Get current player based on token
    try {
      const requestBody = JSON.stringify( curPlayer )
      console.log("this is the requesto body: " + requestBody)
      const response = await api.post("/gamelobbies", requestBody);

      console.log("This is the response data:", response.data)

      const lobby = new Lobby(response.data)


      localStorage.setItem("adminId", curPlayer.id)
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
        const responsePlayers = await api.get("/players");
        const responseUsers = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setPlayers(responsePlayers.data);
        setUsers(responseUsers.data);

        // Get current player based on token
        setCurPlayer(responsePlayers.data.find(user => user.token === localStorage.getItem("token")));

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", responsePlayers.request.responseURL);
        console.log("status code:", responsePlayers.status);
        console.log("status text:", responsePlayers.statusText);
        console.log("requested data:", responsePlayers.data);

        // See here to get more data.
        console.log(responsePlayers);
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

  let contentOnline = <Spinner />
  if (players) {
    contentOnline = (
      <div className="overview">
        <ul className="overview user-list">
          {players.map((player: Player) => (
            <li key={player.id}>
              <PlayerBox
                username={player.name}
                shameTokens={player.shame_tokens}
                you={localStorage.getItem("token") === player.token}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  let contentLosers = <Spinner />
  if (users) {
    contentLosers = (
      <div className="overview">
        <ul className="overview user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <PlayerBox
                username={user.username}
                shameTokens={user.shame_tokens}
                you={localStorage.getItem("token") === user.token}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  let contentUserInfo: any;
  if (curPlayer) {
    contentUserInfo = (
      <div className="overview sub-container">

        <div className="overview">
          <div className="overview header-hey-username">
            <h2 className="light">Hey&nbsp;</h2>
            <h2>{curPlayer.name}</h2>
          </div>
          <div className="overview outer-text-wrapper">
            <div className="overview inner-text-wrapper">
              <p>username</p>
              <p>{curPlayer.name}</p>
            </div>
            <div className="overview inner-text-wrapper">
              <p>Password</p>
              <p>*****</p>
            </div>
            <div className="overview inner-text-wrapper">
              <p>Shame Tokens</p>
              <p>{curPlayer.shame_tokens}</p>
            </div>
            <div className="overview inner-text-wrapper">
              <p>Games Played</p>
              <p>0</p>
            </div>
          </div>
        </div>

        <div className="overview rules-logout-button-wrapper">
          <Button onClick={() => logout()}>Logout</Button>
          <Button className="outlined square">Rules</Button>
        </div>
      </div>
    );
  }

  /*
  * ALTER CODE von Herr dr. Srirangarasa

    return (
      <div className="overview section">
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

   */

  return (
    <div style={{
      backgroundImage: `url(${Background})`,
      backgroundSize: "cover",
      backgroundPosition: "100%",
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>
      <div className="overview section">
        <BaseContainer className="overview container">

          {contentUserInfo}

          <div className="overview vertical-line-box">
            <div className="overview vertical-line" />
          </div>

          <div className="overview sub-container">
            <div className="overview header">
                <h2>Online</h2>
              <div className="player-shame-token">
                <div className="shame-token-wrapper">
                  <img src={shame_logo} alt="" style={{}} />
                  <h3 className="shame-token-count light">77</h3>
                </div>
              </div>
            </div>
            <div className="overview player-container">
              {contentOnline}
            </div>
          </div>


          <div className="overview sub-container">
            <div className="overview header">
              <di>
                <h2>Losers</h2>
              </di>
              <div className="player-shame-token">
                <div className="shame-token-wrapper">
                  <img src={shame_logo} alt="" style={{}} />
                  <span className="shame-token-count">77</span>
                </div>
              </div>
            </div>
            <div className="overview player-container">
              {contentLosers}
            </div>
          </div>
        </BaseContainer>

        <div className="overview button-container">
          <Button className="primary-button" width={300} onClick={() => createLobby()}>
            Create Lobby
          </Button>
          <Button className="primary-button" width={300} onClick={() => navigate("/join")}>
            Join Lobby
          </Button>

        </div>

      </div>
    </div>

  );
};

export default Overview;
