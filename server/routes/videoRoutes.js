import express from "express";
import {
  addNewVideo,
  fetchAllCategories,
  getAllVideos,
  getSingleVideoDetails,
  updateVideoController,
} from "../controllers/videoControllers.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/add-new", formidableMiddleware(), addNewVideo);

router.put("/update/:videoId", formidableMiddleware(), updateVideoController);

router.get("/video-details/:videoId", getSingleVideoDetails);

router.get("/get-categories", fetchAllCategories);

// query: category
router.get("/get-all", getAllVideos);

export default router;
