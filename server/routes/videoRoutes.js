import express from "express";
import {
  addNewVideo,
  fetchAllCategories,
  getAllVideos,
  getSingleVideoDetails,
  toggleLikeOnVideo,
  updateVideoController,
} from "../controllers/videoControllers.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/add-new", formidableMiddleware(), addNewVideo);

router.put("/update/:videoId", formidableMiddleware(), updateVideoController);

// query: likedId or removeLikedId
router.put("/like/:videoId", toggleLikeOnVideo);

router.get("/video-details/:videoId", getSingleVideoDetails);

router.get("/get-categories", fetchAllCategories);

// query: category
router.get("/get-all", getAllVideos);

export default router;
