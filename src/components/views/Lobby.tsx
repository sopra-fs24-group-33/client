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
const TOKEN = "007eJxTYHgXY1m313Ol9ava5N0uuWdTlG+3rWZf+j04o6R3iuCGV6sVGMzMLUySTS3MU5LNUkxSTU0tTRLTkpJSjSxNU8xMjUzSHroopTUEMjJ8Y+pjZWSAQBCfhSE3MTOPgQEApZggcA=="
const CHANNEL = "main"

const Lobby = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [lobby, setLobby] = useState(null);
  const leaveLobby = async () => {
    console.log("player id:", typeof players[0].id)
    console.log("local storage id:", typeof localStorage.getItem("id"))
    const player = players.find(player => player.id.toString() === localStorage.getItem("id"))
    const lobbyPin = localStorage.getItem("pin")

    console.log("lobby Pin:",lobbyPin)

    console.log(player)

    await client.leave();
    navigate("/overview")

    try {
      const requestBody = JSON.stringify( player )
      const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
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

  useEffect(() => {
    const fetchData = async () => {
      const pin = localStorage.getItem("pin");
      try {
        const response = await api.get(`/gamelobbies/${pin}`);
        console.log("This is the response data: ", response.data);

        setLobby(response.data);
        setPlayers(response.data.players);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const joinAndSetupStreams = async () => {
      try {
        const uid = await client.join(APP_ID, CHANNEL, TOKEN);
        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        // Create a video container for the local stream
        const localVideoContainer = document.createElement("div");
        localVideoContainer.id = `player-${uid}`;
        localVideoContainer.className = "video-container"; // Use the CSS class for styling
        document.querySelector(".video-streams").appendChild(localVideoContainer);
        localTracks[1].play(`player-${uid}`); // Play the video in the created container

        await client.publish(localTracks);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            const videoTrack = user.videoTrack;
            const remoteVideoContainer = document.createElement("div");
            remoteVideoContainer.id = `player-${user.uid}`;
            remoteVideoContainer.className = "video-container"; // Use the CSS class for styling
            document.querySelector(".video-streams").appendChild(remoteVideoContainer);
            videoTrack.play(`player-${user.uid}`);
          }
        });

        client.on("user-unpublished", user => {
          const videoContainer = document.getElementById(`player-${user.uid}`);
          if (videoContainer) {
            videoContainer.remove(); // Remove the video container from the DOM
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


  // const leaveLobby = async () => {
  //   await client.leave();
  //   navigate("/overview");
  // };

  let displayPin = lobby ? `${lobby.pin.toString().substring(0, 3)} ${lobby.pin.toString().substr(3)}` : "";

  return (
    <div className="lobby section">
      <div className="video-streams"></div>
      <BaseContainer className="lobby container">
        <h2 className="lobby header">Game Pin: {displayPin}</h2>
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
          <Button className="" width="100%">
            Start Game
          </Button>
        </div>
      </BaseContainer>
    </div>
  );
};

export default Lobby;