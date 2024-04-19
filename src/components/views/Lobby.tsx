import React, { useEffect, useState, useRef } from "react";
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
  const [players, setPlayers] = useState([]);
  const [lobby, setLobby] = useState(null);
  const localTracks = useRef([]);
  const remoteUsers = useRef({});

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const joinAndSetupStreams = async () => {
      try {
        const uid = await client.join(APP_ID, CHANNEL, TOKEN);
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracks.current = tracks;

        // Set up the local video container
        const localVideoContainer = document.createElement("div");
        localVideoContainer.id = `player-${uid}`;
        localVideoContainer.className = "video-container";
        document.querySelector(".video-streams").appendChild(localVideoContainer);
        tracks[1].play(`player-${uid}`);

        // Publish the local tracks to the channel
        await client.publish(tracks);

        client.on("user-published", async (user, mediaType) => {
          remoteUsers.current[user.uid] = user;
          console.log(`User published: ${user.uid}, MediaType: ${mediaType}`);
          await client.subscribe(user, mediaType);
          console.log(`Subscribed to: ${user.uid}`);

          // Check media type and handle accordingly
          if (mediaType === "video") {
            const remoteVideoContainer = document.createElement("div");
            remoteVideoContainer.id = `player-${user.uid}`;
            remoteVideoContainer.className = "video-container";
            document.querySelector(".video-streams").appendChild(remoteVideoContainer);
            user.videoTrack.play(`player-${user.uid}`);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        client.on("user-unpublished", user => {
          // Handle the removal of video container when a user unpublishes their video
          const videoContainer = document.getElementById(`player-${user.uid}`);
          if (videoContainer) {
            videoContainer.remove();
          }
          delete remoteUsers.current[user.uid];
        });

        client.on("user-left", user => {
          // Handle user leaving and remove their video container
          const videoContainer = document.getElementById(`player-${user.uid}`);
          if (videoContainer) {
            videoContainer.remove();
          }
          delete remoteUsers.current[user.uid];
        });

      } catch (error) {
        console.error("Streaming Error:", error);
      }
    };


    joinAndSetupStreams();

    // this makes sure that the tracks are cleaned up when the component is unmounted
    return () => {
      localTracks.current.forEach(track => {
        track.stop();
        track.close();
      });
      client.leave();
    };
  }, []);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      const pin = localStorage.getItem("pin")
      try {
        const requestBody = JSON.stringify(pin)
        const response = await api.get(`/gamelobbies/${pin}`, requestBody);
        console.log("This is the response data: ",  response.data)
        setLobby(response.data);
        setPlayers(response.data.players);
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

  const leaveLobby = async () => {
    const player = players.find(player => player.id.toString() === localStorage.getItem("id"))
    const lobbyPin = localStorage.getItem("pin")
    console.log("lobby Pin:",lobbyPin)
    console.log(player)
    navigate("/overview")
    try {
      const requestBody = JSON.stringify( player )
      const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
      localTracks.current.forEach(track => {
        track.stop();
        track.close();
      });
      await client.leave();
      navigate("/overview");
    } catch (error) {
      console.error("Error leaving the lobby:", handleError(error));
      alert("Something went wrong while leaving the lobby! See the console for details.");


    }
  };

  return (
    <div className="lobby section">
      <div className="video-streams"></div>
      <BaseContainer className="lobby container">
        <h2 className="lobby header">Game Pin: {lobby ? `${lobby.pin.toString().substring(0, 3)} ${lobby.pin.toString().substr(3)}` : ""}</h2>
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