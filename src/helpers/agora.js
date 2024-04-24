import AgoraRTC from "agora-rtc-sdk-ng";

// Configuration constants
const APP_ID = "6784c587dc6d4e5594afbbe295d6524f"
const TOKEN = "007eJxTYPjPo6S/eefdsBPL2O1fZpzb1r7RbiHXuoh68+rLBe4f1/9QYDAztzBJNrUwT0k2SzFJNTW1NElMS0pKNbI0TTEzNTJJa3ivkdYQyMhww+c7IyMDBIL4LAy5iZl5DAwAxPMhhQ=="
const CHANNEL = "main"

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const agoraService = {
  channelParameters: {
    localAudioTrack: null,
    localVideoTrack: null,
    remoteAudioTrack: null,
    remoteVideoTrack: null,
    remoteUid: null,
  },

  async joinAndSetupStreams(userId) {
    this.cleanup(); // Clean existing tracks before joining
    try {
      const uid = await client.join(APP_ID, CHANNEL, TOKEN, userId);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      this.channelParameters.localAudioTrack = audioTrack;
      this.channelParameters.localVideoTrack = videoTrack;

      // Setup local video container
      this.setupVideoContainer(uid, videoTrack);
      await client.publish([audioTrack, videoTrack]);

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
    console.log(`User published: ${user.uid}, MediaType: ${mediaType}`);
    client.subscribe(user, mediaType).then(() => {
      console.log(`Subscribed to: ${user.uid}`);
      this.channelParameters.remoteUid = user.uid;

      if (mediaType === "video") {
        this.channelParameters.remoteVideoTrack = user.videoTrack;
        const remoteVideoContainer = document.createElement("div");
        remoteVideoContainer.id = `player-${user.uid}`;
        remoteVideoContainer.className = "video-container";
        document.querySelector(".video-streams").appendChild(remoteVideoContainer);
        user.videoTrack.play(`player-${user.uid}`);
      }

      if (mediaType === "audio") {
        this.channelParameters.remoteAudioTrack = user.audioTrack;
        user.audioTrack.play(); // Note: Depending on requirements, you might not actually "play" an audio track like this.
      }
    });
  },

  handleUserUnpublished(user) {
    if (this.channelParameters.remoteUid === user.uid) {
      const videoContainer = document.getElementById(`player-${user.uid}`);
      if (videoContainer) {
        videoContainer.remove();
      }
      this.channelParameters.remoteVideoTrack = null;
      this.channelParameters.remoteAudioTrack = null;
      this.channelParameters.remoteUid = null;
    }
  },

  handleUserLeft(user) {
    if (this.channelParameters.remoteUid === user.uid) {
      this.handleUserUnpublished(user);
    }
  },

  cleanup() {
    if (this.channelParameters.localAudioTrack) {
      this.channelParameters.localAudioTrack.stop();
      this.channelParameters.localAudioTrack.close();
      this.channelParameters.localAudioTrack = null;
    }
    if (this.channelParameters.localVideoTrack) {
      this.channelParameters.localVideoTrack.stop();
      this.channelParameters.localVideoTrack.close();
      this.channelParameters.localVideoTrack = null;
    }
    client.leave();
  }
};
