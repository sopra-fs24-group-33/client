import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import GameLobby from "models/Lobby";
import {useNavigate} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import Header from "./Header";
import { Spinner } from "../ui/Spinner";
import OldPlayerBox from "../ui/old-PlayerBox";
import { Player } from "../../types";
import "styles/views/Lobby.scss";
import PlayerBox from "../ui/PlayerBox";
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
const APP_ID = "6784c587dc6d4e5594afbbe295d6524f"
const TOKEN = "007eJxTYAhZ1vSzepXalDyFP1N88zRPL8xUuOdzoSZuu2Tpxd+1+hEKDGbmFibJphbmKclmKSappqaWJolpSUmpRpamKWamRiZp5dcV0hoCGRks57gzMTJAIIjPwpCbmJnHwAAAdmoflA=="
const CHANNEL = "main"

const Lobby = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    const joinAndSetupStreams = async () => {
      try {
        const appId = APP_ID;
        const token = TOKEN;
        const channel = CHANNEL; // Replace with your channel name
        const uid = await client.join(appId, channel, token, null);

        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        await client.publish(localTracks);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            const videoTrack = user.videoTrack;
            videoTrack.play(`player-${user.uid}`);
          }
        });

        client.on("user-unpublished", user => {
          if (user.videoTrack) {
            user.videoTrack.stop();
          }
        });

        return () => {
          localTracks.forEach(track => track.close());
          client.leave();
        };
      } catch (error) {
        console.error("Streaming Error:", error);
      }
    };

    joinAndSetupStreams();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const pin = localStorage.getItem("pin");
      try {
        const response = await api.get(`/gamelobbies/${pin}`);
        setLobby(response.data);
        setPlayers(response.data.players);
      } catch (error) {
        console.error(`Error fetching lobby data: ${handleError(error)}`);
      }
    };

    fetchData();
  }, []);

  const leaveLobby = async () => {
    await client.leave();
    navigate("/overview");
  };

  let content = <Spinner />;
  let displayPin = "";

  if (players && players.length > 0) {
    content = (
      <div className="overview">
        <ul className="overview user-list">
          {players.map((player) => (
            <li key={player.id}>
              <PlayerBox
                username={player.name}
                shameTokens={player.shame_tokens}
                you={localStorage.getItem("id") === player.id.toString()}
              />
              <div id={`player-${player.id}`} className="video-player"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (lobby) {
    displayPin = `${lobby.pin.toString().substring(0, 3)} ${lobby.pin.toString().substr(3)}`;
  }

  return (
    <div className="lobby section">
      <BaseContainer className="lobby container">
        <h2 className="lobby header">Game Pin: {displayPin}</h2>
        <hr className="lobby hr-thin" />
        <div className="lobby player-container">{content}</div>
        <div className="lobby button-container">
          <Button className="outlined" width="100%" onClick={leaveLobby}>
            Leave Lobby
          </Button>
          <Button className="" width="100%">
            Start Game
          </Button>
        </div>
      </BaseContainer>
    </div>
  );
};

export default Lobby;
