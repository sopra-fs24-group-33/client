import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "helpers/api";
import { getWSPreFix } from "helpers/getDomain";
import { GameLobby, Player } from "../../types";
import { Spinner } from "../ui/Spinner";
import PlayerBox from "../ui/PlayerBox";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import "styles/views/Lobby.scss";
import { agoraService } from "helpers/agora";

const Lobby = () => {
  const prefix = getWSPreFix();
  const navigate = useNavigate();
  const lobbyPin = localStorage.getItem('pin');
  const playerId = localStorage.getItem("id");
  const adminId = localStorage.getItem("adminId")
  const [ws, setWs] = useState(null);
  const [lobby, setLobby] = useState<GameLobby>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const userId = localStorage.getItem("id");
  const [teamMatesStream, setTeamMatesStream] = useState([])
  const [localStream, setLocalStream] = useState(null);



  useEffect(() => {

    // Functions to handle stream events
    const handleUserPublished = (user, videoTrack) => {
      setTeamMatesStream(prev => [...prev, { id: user.uid, name: user.uid, videoTrack }]);
    };

    const handleUserUnpublished = (user) => {
      setTeamMatesStream(prev => prev.filter(p => p.id !== user.uid));
    };

    const handleLocalUserJoined = (videoTrack) => {
      setLocalStream(videoTrack);
      // added to team mates to display local stream
      setTeamMatesStream(prev => [...prev,{ id: playerId, name: "Your Stream", videoTrack }]);
    };

    // Connect and setup streams
    agoraService.joinAndPublishStreams(
      userId,
      handleUserPublished,
      handleUserUnpublished,
      handleLocalUserJoined
    );

    return () => {
      agoraService.cleanup();
    };
  }, [userId]);

  console.log("teamMatesStream", teamMatesStream);

  let teamContent = teamMatesStream ? (
    teamMatesStream.map((mate) => (
      <div className="teammate-box" key={mate.id}>
        <div className="webcam-container" ref={el => {
          if (el && mate.videoTrack) {
            mate.videoTrack.play(el);
          }
        }}>
          {mate.name}
        </div>
      </div>
    ))

  ) : <Spinner />;

  useEffect(() => {
    const socket = new WebSocket(`${prefix}/lobby?lobby=${lobbyPin}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      console.log("received msg:", event.data)
      const newLobby = JSON.parse(event.data);
      setLobby(newLobby);
      setPlayers(newLobby.players)
      if (newLobby.gameid) {
        console.log("Game started!");
        localStorage.setItem("gameId", newLobby.gameid);
        navigate("/game")
      }
      console.log("Received data:", newLobby);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    function handleBeforeUnload(event) {
      leaveLobby(); // Asynchronously try to notify the server
      // Optionally add a custom message to the event
      // event.returnValue = "Are you sure you want to leave?";
    }

    // Add the event listener for closing window/tab
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      socket.close();
      // Remove the event listener when the component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const leaveLobby = async () => {
    try {
      const player = lobby.players.find(p => p.id.toString() === playerId);
      const requestBody = JSON.stringify(player)
      console.log("player in lobby.tsx:", requestBody)
      const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
      localStorage.removeItem("pin")
      localStorage.removeItem("adminId")
      navigate("/overview");
    } catch (error) {
      console.error("Error leaving the lobby:", handleError(error));
      alert("Something went wrong while leaving the lobby! See the console for details.");


    }
  };

  const startGame = async () => {
    const response = await api.post(`/startgame/${lobbyPin}`);
    const gamestatus = response.data;
    localStorage.setItem("gameId", gamestatus.id);
    console.log(gamestatus)

    navigate("/game")
  };

  return (
    <div className="lobby section">
      <div className="teammates-container">
        {teamContent}
      </div>
      <BaseContainer className="lobby container">
        <h2 className="lobby header">Game
          Pin: {lobby ? `${lobby.pin.toString().substring(0, 3)} ${lobby.pin.toString().substr(3)}` : ""}</h2>
        <hr className="lobby hr-thin" />
        <div className="lobby player-container">
          {players.length > 0 ? (
            <ul className="overview user-list">
              {players.map(player => (
                <li key={player.id}>
                  <PlayerBox
                    username={player.name}
                    shameTokens={player.shame_tokens}
                    you={localStorage.getItem("id") === player.id.toString()}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <Spinner />
          )}
        </div>
        <div className="lobby button-container">
          <Button className="outlined" width="100%" onClick={leaveLobby}>
            Leave Lobby
          </Button>
          {adminId === playerId && (
            <Button className="" width="100%" onClick={() => startGame()}>
              Start Game
            </Button>
          )}
        </div>
      </BaseContainer>
    </div>
  );
};

export default Lobby;