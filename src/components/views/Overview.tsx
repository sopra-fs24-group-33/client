import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { getWSPreFix } from "helpers/getDomain";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import PlayerBox from "components/ui/PlayerBox";
import { Player, User } from "types";
import Lobby from "models/Lobby";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";
import "../../styles/ui/PlayerBox.scss";
import "../../styles/_theme.scss";
import Rules from "../ui/Rules";
import Join from "./Join";
import JoinPopup from "./Join";


const Overview = () => {
  const prefix = getWSPreFix();
  const navigate = useNavigate();
  const playerId = localStorage.getItem("id");
  const lobbyPin = localStorage.getItem('pin');
  const [players, setPlayers] = useState<Player[]>(null);
  const [users, setUsers] = useState<User[]>(null);
  const [curUser, setCurUser] = useState<User>(null);
  const [curGuest, setCurGuest] = useState<Player>(null);
  const [player, setPlayer] = useState<Player>(null);
  const [showRules, setShowRules] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [ws, setWs] = useState(null);
  const [error, setError] = useState("");

  const handleJoin = async (pin) => {
    const withoutSpacing = pin.replace(/\s/g, '')
    const finalPin = parseInt(withoutSpacing, 10);
    console.log("*pin entered:", finalPin)

    if (withoutSpacing.length < 6) {
      setError("Pin must be 6-digits long")
      return;
    }

    try {
      const response = await api.get(`/gamelobbies/${finalPin}`)
      if (response.data.players.length >= 5) {
        setError("Lobby is full")
        return;
      }
    } catch (error) {
      setError("Invalid Game Pin")
      return;
    }

    const requestBody = JSON.stringify( player )
    await api.post(`/gamelobbies/${finalPin}`, requestBody)
    localStorage.setItem("pin", withoutSpacing);
    navigate("/lobby")

  }

  const logout = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(1000, "logout");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      navigate("/home")
    }
  };

  const createLobby = async () => {
    // Get current player based on token
    try {
      const requestBody = JSON.stringify( player )
      console.log("this is the requesto body: " + requestBody)
      const response = await api.post("/gamelobbies", requestBody);

      console.log("This is the response data:", response.data)

      const lobby = new Lobby(response.data)


      localStorage.setItem("adminId", player.id)
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
    if (playerId === null) {
      navigate("/home")
    }
    if (lobbyPin) {

    }
  }, [playerId, lobbyPin]);

  useEffect(() => {
    console.log("*playerId", localStorage.getItem("id"))
    const socket = new WebSocket(`${prefix}/overview`);
    socket.onopen = () => {
      console.log('*Connected to WebSocket [Overview]');

      const msg = JSON.stringify({ action: "playerId", playerId: playerId});
      socket.send(msg);
    };

    socket.onmessage = (event) => {
      console.log("*user id or player id?:", localStorage.getItem("id"));
      console.log("*received msg:", event.data)
      const data: { players: Player[], users: User[] } = JSON.parse(event.data);
      console.log("*players:", data.players);
      console.log("*users:", data.users);

      const responsePlayers = data.players;
      const responseUsers = data.users;

      setPlayers(responsePlayers);
      setUsers(responseUsers);

      setPlayer(responsePlayers.find(p => p.token === localStorage.getItem("token")));
      setCurUser(responseUsers.find(user => user.token === localStorage.getItem("token")));
      if(!curUser) {
        setCurGuest(responsePlayers.find(g => g.token === localStorage.getItem("token")));
      }
      }

    socket.onclose = () => {
      if (!localStorage.getItem("pin")) {
        logout()
      }
      console.log('*WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('*WebSocket error:', error);
    };

    setWs(socket);

    // Add the event listener for closing window/tab
    return () => {
      socket.close();
      // Remove the event listener when the component unmounts
    };

  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Prevent the default unload behavior and display a warning message
      event.preventDefault(); // Prevents the default unload for some browsers
      event.returnValue = ''; // Required for Chrome
      return "Are you sure you want to leave? You will be logged out if you refresh or close this page.";
    };

    const handleUnload = () => {
      localStorage.removeItem("id")
      localStorage.removeItem("token")
    }

    // Attach the event listener to the window
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  let contentOnline: any;
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

  let contentLosers: any;
  if (users) {
    const sortedUsers = users.slice().sort((a, b) => b.shame_tokens - a.shame_tokens);
    contentLosers = (
      <div className="overview">
        <ul className="overview user-list">
          {sortedUsers.map((user: User) => (
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

  let totalOnlineShameTokens = 0;
  let totalLosersShameTokens = 0;
// Calculate total shame tokens for online players
  if (players) {
    totalOnlineShameTokens = players.reduce((total, player) => total + player.shame_tokens, 0);
  }
// Calculate total shame tokens for losers
  if (users) {
    totalLosersShameTokens = users.reduce((total, user) => total + user.shame_tokens, 0);
  }

  let contentUserInfo: any;
  if (curUser) {
    contentUserInfo = (
      <div className="overview sub-container">
        <div className="overview">
          <div className="overview header-hey-username">
            <h2 className="light">Hey&nbsp;</h2>
            <h2>{curUser.username}</h2>
          </div>
          <div className="overview outer-text-wrapper">
            <div className="overview inner-text-wrapper">
              <p>username</p>
              <p>{curUser.username}</p>
            </div>
            <div className="overview inner-text-wrapper">
              <p>Shame Tokens</p>
              <p>{curUser.shame_tokens}</p>
            </div>
            <div className="overview inner-text-wrapper">
              <p>Games Played</p>
              <p>{curUser.gamesplayed ? curUser.gamesplayed : 0}</p>
            </div>
          </div>
        </div>
        <div className="overview rules-logout-button-wrapper">
          <Button onClick={() => logout()}>Logout</Button>
          <Button className="outlined square" onClick={() => setShowRules(true)}>Rules</Button>
        </div>
      </div>
    );
  } else if (curGuest) {
    contentUserInfo = (
      <div className="overview sub-container">
        <div className="overview">
          <div className="overview header-hey-username">
            <h2 className="light">Hey&nbsp;</h2>
            <h2>{curGuest.name}</h2>
          </div>
          <div className="overview outer-text-wrapper">
            <div className="overview inner-text-wrapper">
              <p>username</p>
              <p>{curGuest.name}</p>
            </div>
            <div className="overview inner-text-wrapper">
              <p>Shame Tokens</p>
              <p>{curGuest.shame_tokens}</p>
            </div>
          </div>
        </div>
        <div className="overview rules-logout-button-wrapper">
          <Button onClick={() => logout()}>Logout</Button>
          <Button className="outlined square" onClick={() => setShowRules(true)}>Rules</Button>
        </div>
      </div>
    );
  }


  else {
    contentUserInfo=
    <Button onClick={() => logout()}>Logout</Button>;
  }
  console.log("ATTENTION PLEASE THIS IS THE CURRENT GUESZT", curGuest);

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
                  <h3 className="shame-token-count light">{totalOnlineShameTokens}</h3>
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
                  <h3 className="shame-token-count light">{totalLosersShameTokens}</h3>
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
          <Button className="primary-button" width={300} onClick={() => setShowJoin(true)}>
            Join Lobby
          </Button>
        </div>
      </div>
      {showJoin &&
        <JoinPopup
          onClose={() => setShowJoin(false)}
          onJoin={handleJoin}
          error={error}
        />
      }
      {showRules && <Rules onClose={() => setShowRules(false)}/>}
    </div>


  );
};

export default Overview;
