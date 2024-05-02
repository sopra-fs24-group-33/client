import React, { useEffect, useState, useRef, useCallback } from "react";
import { api, handleError } from "helpers/api";
import { getWSPreFix } from "helpers/getDomain";
import { GameLobby, Player } from "../../types";
import { Spinner } from "../ui/Spinner";
import PlayerBox from "../ui/PlayerBox";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import "styles/views/Lobby.scss";
import { useAgoraService } from 'helpers/agoracontext';


const Lobby = () => {
  const prefix = getWSPreFix();
  const navigate = useNavigate();
  const lobbyPin = localStorage.getItem('pin');
  const playerId = localStorage.getItem("id");
  const adminId = localStorage.getItem("adminId")
  const [ws, setWs] = useState(null);
  const [lobby, setLobby] = useState<GameLobby>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersMap, setPlayersMap] = useState(new Map());
  const userId = localStorage.getItem("id");
  const [teamMates, setTeamMates] = useState([])
  const [teamMatesStream, setTeamMatesStream] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);
  const agoraService = useAgoraService();

  const handleUserPublished = (user, videoTrack) => {

    setTeamMates(prev => [...prev, { id: user.uid, name: "neme",  }]);
    setTeamMatesStream(prev => new Map(prev).set(user.uid, user.videoTrack));
    console.log("# user published", user, videoTrack);

  };

  const handleUserUnpublished = (user) => {
    setTeamMates(prev => prev.filter(p => p.id !== user.uid));
    setTeamMatesStream(prev => {
      const updated = new Map(prev);
      updated.delete(user.uid);
      return updated;
    });
  };

  const handleLocalUserJoined = (videoTrack) => {
    setLocalStream(videoTrack);
    // added to team mates to display local stream
    setTeamMates(prev => [...prev,{ id: playerId, name:  "neme",  }]);
    setTeamMatesStream(prev => new Map(prev).set(playerId, videoTrack ));
  };


  useEffect(() => {

    const setupStreams = async () => {
      try {
        const response = await api.get(`agoratoken/${lobbyPin}/${userId}`);

        agoraService.joinAndPublishStreams(
          userId,
          response.data,
          String(lobbyPin),
          handleUserPublished,
          handleUserUnpublished,
          handleLocalUserJoined
        );


      } catch (error) {
        console.error('Failed to get Agora token:', error);
        // Handle errors, e.g., show notification or error message to user
      }
    };

    // Call the async function
    setupStreams();

    // Specify how to clean up after this effect:
    return () => {
      // agoraService.cleanup();
    };
  }, [userId, lobbyPin]);





  useEffect(() => {
    localStorage.removeItem("inGame")
    const socket = new WebSocket(`${prefix}/lobby?lobby=${lobbyPin}`);
    console.log("lobby pin:", lobbyPin)

    console.log("admin id:", adminId)
    console.log("player id:", playerId)



    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      console.log("received msg:", event.data)
      if (event.data === "leave") {
        localStorage.removeItem("pin");
        agoraService.cleanup();
        navigate("/overview");
        return;
      }
      const newLobby = JSON.parse(event.data);
      setLobby(newLobby);
      setPlayers(newLobby.players)
      if (newLobby.gameid) {
        console.log("Game started!");
        localStorage.setItem("gameId", newLobby.gameid);
        navigate('/game');
      }

      const newMap = new Map();
      newLobby.players.forEach(player => {
        newMap.set(player.id, player);
      });
      setPlayersMap(newMap);

      console.log("Received data:", newLobby);
    };

    socket.onclose = async () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

    async function handleBeforeUnload(event) {
      // TODO: when refreshing this gets triggered, but I want to trigger this when closing
      console.log("TEST::::::::::::::::::")
//      event.preventDefault(); // Optionally prompt the user to confirm exit
//      // Asynchronously notify the server that the user is leaving the lobby
//      await leaveLobby(); // Call leaveLobby synchronously using async/await
//      // Clear the local storage items
//      localStorage.removeItem("pin");
//      localStorage.removeItem("adminId");
//      navigate("/overview"); // Navigate the user away after successful API call
      // The return value for modern browsers to show the confirmation dialog
//      event.returnValue = ''; // Chrome requires returnValue to be set
    }

    // Add the event listener for closing window/tab
    return () => {
      socket.close();
      // Remove the event listener when the component unmounts
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
      agoraService.cleanup();
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
  console.log("# players", players)
  console.log("# setTeamMatesStream", teamMatesStream)
  console.log("# agoraService.getVideoTracks", agoraService.getVideoTracks());

  let teamContent = players.length > 0 ? (
    Array.from(agoraService.getVideoTracks().entries()).map(([id, videoTrack]) => {

      const player = playersMap.get(parseInt(id));


      return (
        <div className="teammate-box" key={id}>
          <div className="webcam-container" ref={el => {
            if (el) {
              videoTrack.play(el);
            }
          }}>
            {/* You can place an overlay or icon here if needed */}
          </div>
          <div className="player-name">{player ? player.name : "Loading..."}</div>
        </div>
      );
    })
  ) : <Spinner />;

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
            <Button className="" width="100%" onClick={() => startGame()} disabled={players.length <= 1}>
              Start Game
            </Button>
          )}
        </div>
      </BaseContainer>
    </div>
  );
};

export default Lobby;