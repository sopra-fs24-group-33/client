import AgoraRTC from "agora-rtc-sdk-ng";

// Configuration constants
const APP_ID = "bb103a1b0b3c477ea5bae0cc1c32525f";
const APP_CERTIFICATE = 'd016d99bc4d8434aa063a0efe54412f1';
const TOKEN = "007eJxTYOiS/mZd5f3JSMcu4JPdxOXzHszyYcmTPcnKd2/Cnfh379MUGMzMLUySTS3MU5LNUkxSTU0tTRLTkpJSjSxNU8xMjUzSXu7VTmsIZGR4bHCKkZEBAkF8FobcxMw8BgYAUhcgHw==";
const CHANNEL = "main";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = {
  videoTrack: null,
  audioTrack: null
};

// Store for the video tracks
const videoTracks = new Map();
const audioTracks = new Map();
let localMute = false;

export const agoraService = {
  async joinAndPublishStreams(userId, Token, lobbyPin, handleUserPublished, handleUserUnpublished, handleLocalUserJoined) {
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        videoTracks.set(user.uid, user.videoTrack);
        handleUserPublished(user, user.videoTrack, "video");
      } else if (mediaType === "audio") {
        audioTracks.set(user.uid, user.audioTrack);
        audioTracks.get(user.uid).play();
        handleUserPublished(user, user.audioTrack, "audio");
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        videoTracks.delete(user.uid);
      } else if (mediaType === "audio") {
        audioTracks.delete(user.uid);
      }
      handleUserUnpublished(user, mediaType);
    });

    try {
      await client.join(APP_ID, lobbyPin, Token, userId);

      try {
        [localTracks.audioTrack, localTracks.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      } catch (err) {
        console.warn("Camera not found or permission denied:", err);
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      }

      if (localTracks.videoTrack) {
        videoTracks.set(userId, localTracks.videoTrack);
      }

      audioTracks.set(userId, localTracks.audioTrack);

      await client.publish(Object.values(localTracks).filter(track => track !== null));

      handleLocalUserJoined(localTracks.videoTrack, localTracks.audioTrack);
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
    audioTracks.clear();
  },

  getVideoTracks() {
    return videoTracks;
  },

  getAudioTracks() {
    return audioTracks;
  },

  muteselfe() {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(false);
      localMute = true;
    }
  },

  unmuteselfe() {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(true);
      localMute = false;
    }
  },

  isMicMuted() {
    if (localTracks.audioTrack) {
      return !localTracks.audioTrack.enabled;
    }
    return false;
  },

  audioTrackExists() {
    const audioTrack = localTracks.audioTrack;
    const hasEnabledMutex = audioTrack && audioTrack._enabledMutex !== null && audioTrack._enabledMutex !== undefined;

    console.log("# audioTrackExists", audioTrack, "!!audioTrack", !!audioTrack, "has _enabledMutex", hasEnabledMutex);

    return !!audioTrack && hasEnabledMutex;
  }
};
