import React, { useEffect, useState } from "react";
import { agoraService } from "./agora"; // Adjust the path as necessary

const VideoStreamComponent = () => {
  const [teamMates, setTeamMates] = useState([]);

  useEffect(() => {
    const userId = Math.floor(Math.random() * 10000); // Generate a random user ID for demonstration purposes

    // Function to handle when a user publishes their stream
    const handleUserPublished = (user, videoTrack) => {
      setTeamMates(prevTeamMates => [
        ...prevTeamMates,
        { id: user.uid, videoTrack }
      ]);
    };

    // Function to handle when a user unpublishes their stream
    const handleUserUnpublished = (user) => {
      setTeamMates(prevTeamMates =>
        prevTeamMates.filter(teamMate => teamMate.id !== user.uid)
      );
    };

    // Join and publish stream
    agoraService.joinAndPublishStreams(userId, handleUserPublished, handleUserUnpublished);

    return () => {
      // Cleanup the streams on component unmount
      agoraService.cleanup();
    };
  }, []);

  return (
    <div>
      {teamMates.map((player) => (
        <div key={player.id} className="player-video">
          <div id={`player-${player.id}`} className="video-container">
            {/* The video stream will be played inside this div */}
          </div>
          <p>User ID: {player.id}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoStreamComponent;
