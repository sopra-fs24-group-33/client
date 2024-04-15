import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import PlayerBoxNew from  "components/ui/PlayerBoxNew";
import { Player } from "types";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import Lobby from "models/Lobby";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";
import "../../styles/ui/PlayerBoxNew.scss";


const Overview = () => {

  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>(null);
  const [curPlayer, setCurPlayer] = useState<Player>(null);

  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const logout = async () => {
    const id = localStorage.getItem("id");
    localStorage.removeItem("token");
    await api.delete(`/players/${id}`)
    navigate("/home");
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

        // Get current player based on token
        setCurPlayer(response.data.find(user => user.token === localStorage.getItem("token")));

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
              <PlayerBoxNew
                username={player.guestname}

                shameTokens={player.shame_tokens}
                you={localStorage.getItem("token") === player.token}
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
          <h2>Hey {curPlayer.guestname}</h2>
          <div className="overview outer-text-wrapper">
            <div className="overview inner-text-wrapper">
              <p>username</p>
              <p>{curPlayer.guestname}</p>
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
              <di>
                <h2>Online</h2>
              </di>
              <div className="player-shame-token">
                <div className="shame-token-wrapper">
                  <img src={shame_logo} alt="" style={{}} />
                  <span className="shame-token-count">77</span>
                </div>
              </div>
            </div>
            <div className="overview player-container">
              {content}
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
              {content}
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
