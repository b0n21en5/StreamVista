import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    pic: {
      data: Buffer,
      contentType: String,
    },
    isChannel: {
      type: Boolean,
      default: false,
    },
    channel: {
      type: mongoose.Types.ObjectId,
      ref: "channels",
      default: null,
    },
    subscribed: [
      {
        type: mongoose.Types.ObjectId,
        ref: "channels",
      },
    ],
    watchList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "videos",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
