import React, { useEffect, useState } from "react";
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
// @ts-ignore
import ButtonMute from "../../assets/icons/ButtonMute.svg";
// @ts-ignore
import ButtonUnmute from "../../assets/icons/ButtonUnmute.svg";
import Rules from "../ui/popUps/Rules";

const Lobby = () => {
  const prefix = getWSPreFix();
  const navigate = useNavigate();
  const totalPlayerBoxes = 5;
  const lobbyPin = localStorage.getItem('pin');
  const playerId = localStorage.getItem("id");
  const adminId = localStorage.getItem("adminId")
  const [ws, setWs] = useState(null);
  const [lobby, setLobby] = useState<GameLobby>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const emptyPlayerBoxesCount = totalPlayerBoxes - players.length;
  const [playersMap, setPlayersMap] = useState(new Map());
  const userId = localStorage.getItem("id");
  const [teamMates, setTeamMates] = useState([])
  const [teamMatesStream, setTeamMatesStream] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);
  const agoraService = useAgoraService();
  const [isMuted, setIsMuted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [admin, setAdmin] = useState();


  const toggleMute = () => {
    try {
      console.log("# toggleMute", agoraService.audioTrackExists());
      if (agoraService.audioTrackExists()) {
        if (isMuted) {
          agoraService.unmuteselfe();
        } else {
          agoraService.muteselfe();
        }
        setIsMuted(!isMuted);
      }
    } catch (error) {

      }

  };


  useEffect(() => {
    const checkMicStatus = async () => {
      console.log("# checkMicStatus", agoraService.audioTrackExists())
      if (!agoraService.audioTrackExists()) {
        return;
      }
      const micStatus = agoraService.isMicMuted();
      setIsMuted(micStatus);
    };
    checkMicStatus();
  }, []);

  // useEffect(() => {
  //
  //   const unmute_if_muted = async () => {
  //     if (isMuted) {
  //       agoraService.unmuteselfe();}
  //     };
  //     unmute_if_muted();
  // }, []);

  const emptyPlayerBoxes = Array.from({ length: emptyPlayerBoxesCount }, (_, index) => (
    <li key={`empty_${index}`}>
      <PlayerBox />
    </li>
  ));

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
    const micStatus = agoraService.isMicMuted();
    console.log("# micStatus", micStatus)
    setIsMuted(micStatus);
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

    return () => {
      // agoraService.cleanup();
    };
  }, [userId, lobbyPin]);

  useEffect(() => {
    localStorage.removeItem("inGame")
    localStorage.removeItem("end")
    localStorage.removeItem('flawlessWin')
    localStorage.removeItem("lvl")
    localStorage.removeItem("lost");
    const socket = new WebSocket(`${prefix}/lobby?lobby=${lobbyPin}`);
    console.log("lobby pin:", lobbyPin)


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

      const adminFound = newLobby.players.find(p => p.id === newLobby.admin);
      setAdmin((adminFound));

      console.log("Received data:", newLobby);
    };

    socket.onclose = async () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);

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

    Array.from(playersMap.entries()).map(([id, player]) => {

      const videoTrack = agoraService.getVideoTracks().get(id.toString());

      if (player.id != playerId) {
        return (
          <div className="teammate-box" key={id}>
            <div className="webcam-container" ref={el => {
              if (el && videoTrack) {
                videoTrack.play(el);
              }
            }}>
              {/* You can place an overlay or icon here if needed */}

            </div>
            <h3 className="player-name">{player ? player.name : "Loading..."}</h3>
          </div>
        );
      } else {
        return null;
      }
    })
  ) : <Spinner />;


  return (
    <div className="lobby section">
      <div className="teammates-container">
        {teamContent}
      </div>

      <BaseContainer className="lobby container">
        <div className="lobby sub-container">
          <div className="lobby header">
            <h2>
              Game Pin
            </h2>
            <h2 className="light">
              {lobby ? `${lobby.pin.toString().substring(0, 3)} ${lobby.pin.toString().substr(3)}` : ""}
            </h2>
          </div>
          <div className="admin-wrapper">
            <p> {"Admin: "} </p>
            <h3>{admin ? `${admin.name}` : ""} </h3>

          </div>
          <Button className="outlined square" onClick={() => setShowRules(true)}>Rules</Button>
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
        </div>

        <div className="vertical-line " />

        <div className="lobby player-container">
          {players.length > 0 ? (
            <ul className="overview user-list">
              {/* Render existing players */}
              {players.map(player => (
                <li key={player.id}>
                  <PlayerBox
                    username={player.name}
                    shameTokens={player.shame_tokens}
                    you={localStorage.getItem("id") === player.id.toString()}
                  />
                </li>
              ))}
              {/* Render empty player boxes */}
              {emptyPlayerBoxes}
            </ul>
          ) : (
            <Spinner />
          )}
          {showRules && <Rules onClose={() => setShowRules(false)}/>}
        </div>

      </BaseContainer>

      <div className="my-webcam-and-control-box">
        <div className="pov-container my-webcam" ref={el => {
          if (el && agoraService.getVideoTracks().get(playerId.toString())) {
            agoraService.getVideoTracks().get(playerId.toString()).play(el);
          }
        }}>
        </div>
        <div className="control-box">
          {isMuted ? (
            <img className="button-mute" src={ButtonUnmute} alt="" onClick={toggleMute} />
          ) : (
            <img className="button-unmute" src={ButtonMute} alt="" onClick={toggleMute} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;