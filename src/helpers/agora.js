import AgoraRTC from "agora-rtc-sdk-ng";

// Configuration constants
const APP_ID = "6784c587dc6d4e5594afbbe295d6524f"
const TOKEN = "007eJxTYGDSsjmawTR/5qfn7QkeaRpJCWElSzQnlH/LZVGWlpfJ2KfAYGZuYZJsamGekmyWYpJqamppkpiWlJRqZGmaYmZqZJKWoqGW1hDIyOCXaMXCyACBID4LQ25iZh4DAwBEzRs+"
const CHANNEL = "main"

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const agoraService = {
  localTracks: [],
  remoteUsers: {},

  async joinAndSetupStreams(userId) {
    try {
      const uid = await client.join(APP_ID, CHANNEL, TOKEN, userId);
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      this.localTracks = tracks;

      // Setup local video container
      this.setupVideoContainer(uid, tracks[1]);

      await client.publish(tracks);

      client.on("user-published", async (user, mediaType) => {
        this.handleUserPublished(user, mediaType);
      });

      client.on("user-unpublished", user => {
        this.handleUserUnpublished(user);
      });

      client.on("user-left", user => {
        this.handleUserLeft(user);
      });

    } catch (error) {
      console.error("Streaming Error:", error);
    }
  },

  setupVideoContainer(uid, videoTrack) {
    const localVideoContainer = document.createElement("div");
    localVideoContainer.id = `player-${uid}`;
    localVideoContainer.className = "video-container";
    document.querySelector(".video-streams").appendChild(localVideoContainer);
    videoTrack.play(`player-${uid}`);
  },

  handleUserPublished(user, mediaType) {
    this.remoteUsers[user.uid] = user;
    console.log(`User published: ${user.uid}, MediaType: ${mediaType}`);
    client.subscribe(user, mediaType).then(() => {
      console.log(`Subscribed to: ${user.uid}`);

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
  },

  handleUserUnpublished(user) {
    const videoContainer = document.getElementById(`player-${user.uid}`);
    if (videoContainer) {
      videoContainer.remove();
    }
    delete this.remoteUsers[user.uid];
  },

  handleUserLeft(user) {
    const videoContainer = document.getElementById(`player-${user.uid}`);
    if (videoContainer) {
      videoContainer.remove();
    }
    delete this.remoteUsers[user.uid];
  },

  cleanup() {
    this.localTracks.forEach(track => {
      track.stop();
      track.close();
    });
    client.leave();
  }
};
