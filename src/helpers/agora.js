import AgoraRTC from "agora-rtc-sdk-ng";

//const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// Configuration constants
const APP_ID = "bb103a1b0b3c477ea5bae0cc1c32525f"
const APP_CERTIFICATE = 'd016d99bc4d8434aa063a0efe54412f1';
const TOKEN = "007eJxTYOiS/mZd5f3JSMcu4JPdxOXzHszyYcmTPcnKd2/Cnfh379MUGMzMLUySTS3MU5LNUkxSTU0tTRLTkpJSjSxNU8xMjUzSXu7VTmsIZGR4bHCKkZEBAkF8FobcxMw8BgYAUhcgHw=="
const CHANNEL = "main"




const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = {
  videoTrack: null,
  audioTrack: null
};


export const agoraService = {
  async joinAndPublishStreams(userId, Token,lobbyPin, handleUserPublished, handleUserUnpublished, handleLocalUserJoined) {
    // Set up event listeners as early as possible
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log("# Subscribed to user", user.uid, "for media type", mediaType);
      if (mediaType === "video") {
        handleUserPublished(user, user.videoTrack);
      }
      // Additional handling for audio if needed
    });

    client.on("user-unpublished", user => {
      handleUserUnpublished(user);
    });

    try {
      console.log("# Joining with APP_ID:", APP_ID);
      console.log("# Channel Name:", lobbyPin);
      console.log("# Token:", Token);
      console.log("# User ID:", userId);
      await client.join(APP_ID, lobbyPin, Token, userId);
      console.log("# Joined channel with user ID:", userId);

      [localTracks.audioTrack, localTracks.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      // After joining, publish local tracks
      await client.publish(Object.values(localTracks));
      console.log("# Published local tracks");
      handleLocalUserJoined(localTracks.videoTrack);

    } catch (error) {
      console.error("Error in Agora Stream Setup:", error);
    }
  },

  async cleanup() {
    // Unpublish and close local tracks
    localTracks.videoTrack?.close();
    localTracks.audioTrack?.close();
    await client.leave();
    client.removeAllListeners();
    console.log("# Agora cleanup done.");
  }
};