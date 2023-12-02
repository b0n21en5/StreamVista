import express from "express";
import {
  addNewVideo,
  deleteVideoController,
  fetchAllCategories,
  getAllVideos,
  getSingleVideoDetails,
  searchVideosChannels,
  toggleLikeOnVideo,
  updateVideoController,
} from "../controllers/videoControllers.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/add-new", formidableMiddleware(), addNewVideo);

router.put("/update/:videoId", formidableMiddleware(), updateVideoController);

router.delete("/delete/:videoId", deleteVideoController);

// query: likedId or removeLikedId
router.put("/like/:videoId", toggleLikeOnVideo);

router.get("/video-details/:videoId", getSingleVideoDetails);

router.get("/get-categories", fetchAllCategories);

// query: category
router.get("/get-all", getAllVideos);

// query: q
router.get("/search", searchVideosChannels);

export default router;
