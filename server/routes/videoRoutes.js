import express from "express";
import {
  addNewVideo,
  deleteVideoController,
  fetchAllCategories,
  getAllVideos,
  getLikedVideos,
  getSingleVideoDetails,
  getVideoComments,
  getVideoController,
  getVideoThumbnail,
  searchVideosChannels,
  toggleLikeOnVideo,
  updateVideoComments,
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
router.get("/video-thumbnail/:videoId", getVideoThumbnail);
router.get("/get-video/:videoId", getVideoController);

router.get("/get-categories", fetchAllCategories);

// query: category
router.get("/get-all", getAllVideos);
router.get("/liked-videos/:userId", getLikedVideos);

// query: q
router.get("/search", searchVideosChannels);

router.put("/comments/:videoId", updateVideoComments);
router.get("/all-comments/:videoId", getVideoComments);

// query: q
router.get("/search", searchVideosChannels);

export default router;
