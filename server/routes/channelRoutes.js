import express from "express";
import {
  createChannelController,
  getAllChannels,
  updateChannel,
} from "../controllers/channelControllers.js";

const router = express.Router();

router.post("/create", createChannelController);
router.put("/update/:channelId", updateChannel);

router.get("/get-all", getAllChannels);

export default router;
