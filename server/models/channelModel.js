import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    videos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "videos",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("channels", channelSchema);
