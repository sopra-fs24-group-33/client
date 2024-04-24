import AgoraRTC from "agora-rtc-sdk-ng";

// Configuration constants
const APP_ID = "6784c587dc6d4e5594afbbe295d6524f"
const TOKEN = "007eJxTYPjPo6S/eefdsBPL2O1fZpzb1r7RbiHXuoh68+rLBe4f1/9QYDAztzBJNrUwT0k2SzFJNTW1NElMS0pKNbI0TTEzNTJJa3ivkdYQyMhww+c7IyMDBIL4LAy5iZl5DAwAxPMhhQ=="
const CHANNEL = "main"


const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = {
  videoTrack: null,
  audioTrack: null
};


export const agoraService = {
  async joinAndPublishStreams(userId, handleUserPublished, handleUserUnpublished) {
    try {
      await client.join(APP_ID, CHANNEL, TOKEN, userId);

      // Create and publish local tracks
      [localTracks.audioTrack, localTracks.videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      await client.publish(Object.values(localTracks));

      // Handle other users' publications
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          handleUserPublished(user, user.videoTrack);
        }
        // Additional handling for audio if necessary
      });

      client.on("user-unpublished", user => {
        handleUserUnpublished(user);
      });

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
  }
};
