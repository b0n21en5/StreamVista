import express from "express";
import {
  getProfilePic,
  loginController,
  registerController,
  resetPassword,
  updatedUserController,
} from "../controllers/userControllers.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

router.post("/register", formidableMiddleware(), registerController);
router.post("/login", loginController);
router.put("/reset-password", resetPassword);
router.put("/update-user", formidableMiddleware(), updatedUserController);
router.get("/profile-picture/:uid", getProfilePic);

export default router;
