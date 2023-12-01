import express from "express";
import {
  createChannelController,
  getAllChannels,
  getChannelDetails,
  getChannelVideos,
  updateChannel,
} from "../controllers/channelControllers.js";

const router = express.Router();

router.post("/create", createChannelController);
router.put("/update/:channelId", updateChannel);

router.get("/get-all", getAllChannels);
router.get("/channel-details/:channelId", getChannelDetails);
router.get("/channel-videos/:channelId", getChannelVideos);

export default router;
