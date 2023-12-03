import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    video: {
      data: Buffer,
      contentType: String,
    },
    thumbnail: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      required: true,
    },
    channel: {
      type: mongoose.Types.ObjectId,
      ref: "channels",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
        message: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("videos", videoSchema);
