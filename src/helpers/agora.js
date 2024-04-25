import AgoraRTC from "agora-rtc-sdk-ng";

// Configuration constants
const APP_ID = "6784c587dc6d4e5594afbbe295d6524f"
const TOKEN = "007eJxTYHB/I23or7zzgWdaZeR/jj0lUWGL/Xde2F5Uc6XwwB/mFZIKDGbmFibJphbmKclmKSappqaWJolpSUmpRpamKWamRiZpzxy10hoCGRmsEj+yMDJAIIjPwpCbmJnHwAAATocfjA=="
const CHANNEL = "main"


const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = {
  videoTrack: null,
  audioTrack: null
};


export const agoraService = {
  async joinAndPublishStreams(userId, handleUserPublished, handleUserUnpublished, handleLocalUserJoined) {
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
      await client.join(APP_ID, CHANNEL, TOKEN, userId);
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