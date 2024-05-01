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


// Store for the video tracks
const videoTracks = new Map();

export const agoraService = {
  async joinAndPublishStreams(userId, Token, lobbyPin, handleUserPublished, handleUserUnpublished, handleLocalUserJoined) {
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        videoTracks.set(user.uid, user.videoTrack);
        handleUserPublished(user, user.videoTrack);
      }
    });

    client.on("user-unpublished", user => {
      videoTracks.delete(user.uid);
      handleUserUnpublished(user);
    });

    try {
      await client.join(APP_ID, lobbyPin, Token, userId);
      [localTracks.audioTrack, localTracks.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      videoTracks.set(userId, localTracks.videoTrack);
      await client.publish(Object.values(localTracks));
      handleLocalUserJoined(localTracks.videoTrack);
    } catch (error) {
      console.error("Error in Agora Stream Setup:", error);
    }
  },

  cleanup() {
    localTracks.videoTrack?.close();
    localTracks.audioTrack?.close();
    client.leave();
    client.removeAllListeners();
    videoTracks.clear();
  },

  getVideoTracks() {
    return videoTracks;
  }
};