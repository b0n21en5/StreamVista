import express from "express";
import {
  getProfilePic,
  getSubscribedChannelDetails,
  loginController,
  registerController,
  resetPassword,
  toogleChannelSubscribe,
  getWatchListVideos,
  updateWatchListcontroller,
  updatedUserController,
} from "../controllers/userControllers.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/register", formidableMiddleware(), registerController);
router.post("/login", loginController);
router.put("/reset-password", resetPassword);
router.put("/update-user", formidableMiddleware(), updatedUserController);
router.put("/subscribe/:userId", toogleChannelSubscribe);
router.get("/profile-picture/:uid", getProfilePic);
router.get("/subscribed-channels/:userId", getSubscribedChannelDetails);

router.put("/watch-list/:userId", updateWatchListcontroller); //query: addId or removeId
router.get("/watch-list/:userId", getWatchListVideos);

export default router;
