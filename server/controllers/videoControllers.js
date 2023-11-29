import { clientError, serverError } from "../helpers/handleErrors.js";
import videoModel from "../models/videoModel.js";
import fs from "fs";

export const addNewVideo = async (req, res) => {
  try {
    const { title, description, channel, category } = req.fields;
    const { video, thumbnail } = req.files;

    if (!title) return clientError(res, "Video title required!");
    if (!description) return clientError(res, "Video description required!");
    if (!channel) return clientError(res, "Channel Id required!");
    if (!category) return clientError(res, "Video category required!");
    if (!video && video.size > 5000000)
      return clientError(res, "Video required & size must be less than 5mb!");
    if (!thumbnail && thumbnail.size > 1000000)
      return clientError(
        res,
        "Thumbnail required & size must be less than 1mb!"
      );

    const newVideo = await videoModel(req.fields);

    newVideo.video.data = fs.readFileSync(video.path);
    newVideo.video.contentType = video.type;

    newVideo.thumbnail.data = fs.readFileSync(thumbnail.path);
    newVideo.thumbnail.contentType = thumbnail.type;

    await newVideo.save();

    newVideo.video.data = "****";
    newVideo.thumbnail.data = "****";

    return res.send(newVideo);
  } catch (error) {
    return serverError(res, error, "Error adding new video!");
  }
};

export const updateVideoController = async (req, res) => {
  try {
    const { videoId } = req.params;
    const dbVideo = await videoModel.findById(videoId);
    if (!dbVideo) return clientError(res, "Video Not Found!");

    const { title, description, category } = req.fields;
    const { video, thumbnail } = req.files;

    if (video && video.size > 5000000) {
      return clientError(res, "Video size must be less than 5mb!");
    }
    if (thumbnail && thumbnail.size > 1000000) {
      return clientError(res, "Thumbnail size must be less than 1mb!");
    }

    if (title) dbVideo.title = title;
    if (description) dbVideo.description = description;
    if (category) dbVideo.category = category;

    if (video) {
      dbVideo.video.data = fs.readFileSync(video.path);
      dbVideo.video.contentType = video.type;
    }

    if (thumbnail) {
      dbVideo.thumbnail.data = fs.readFileSync(thumbnail.path);
      dbVideo.thumbnail.contentType = thumbnail.type;
    }

    const updatedVideo = await dbVideo.save();

    updatedVideo.video.data = "****";
    updatedVideo.thumbnail.data = "****";

    return res.send(updatedVideo);
  } catch (error) {
    return serverError(res, error, "Error updating video!");
  }
};

export const getSingleVideoDetails = async (req, res) => {
  try {
    const video = await videoModel
      .findById(req.params.videoId)
      .populate("channel");
    if (!video) {
      return clientError(res, "Video Not Found!");
    }

    video.views++;
    await video.save();

    const response = {
      title: video.title,
      description: video.description,
      category: video.category,
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      videoData: video.video.data.toString("base64"),
      videoContentType: video.video.contentType,
      thumbnailData: video.thumbnail.data.toString("base64"),
      thumbnailContentType: video.thumbnail.contentType,
      channel: video.channel,
    };

    return res.send(response);
  } catch (error) {
    return serverError(res, error, "Error fetching video details!");
  }
};

export const fetchAllCategories = async (req, res) => {
  try {
    const videos = await videoModel.find().select("category");

    const uniqueCategories = new Set(videos.map((video) => video.category));

    const allCategories = Array.from(uniqueCategories);

    return res.send(allCategories);
  } catch (error) {
    return serverError(res, error, "Error Fetching All Categories!");
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const { category, similarVideos, videoId } = req.query;
    const args = {};

    if (category || similarVideos) {
      args["category"] = category || similarVideos;
    }

    const allVideos = await videoModel
      .find(args)
      .select("title thumbnail channel views")
      .populate("channel");

    let response = allVideos.map((video) => ({
      _id: video.id,
      title: video.title,
      thumbnailData: video.thumbnail.data.toString("base64"),
      thumbnailContentType: video.thumbnail.type,
      channel: video.channel,
      views: video.views,
    }));

    if (videoId) {
      response = response.filter((video) => video._id !== videoId);
    }

    return res.send(response);
  } catch (error) {
    return serverError(res, error, "Error fetching all videos!");
  }
};

export const toggleLikeOnVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { likedId, removeLikedId } = req.query;

    let video = await videoModel.findById(videoId);

    if (likedId) {
      video.likes.push(likedId);
    }

    if (removeLikedId) {
      video.likes = video.likes.filter((id) => id.toString() !== removeLikedId);
    }

    await video.save();

    const likes = video.likes;

    return res.send(likes);
  } catch (error) {
    return serverError(res, error, "Error While Like/remove Like!");
  }
};
