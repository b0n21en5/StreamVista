import mongoose from "mongoose";
import { clientError, serverError } from "../helpers/handleErrors.js";
import channelModel from "../models/channelModel.js";
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

export const deleteVideoController = async (req, res) => {
  try {
    const video = await videoModel.findByIdAndDelete(req.params.videoId);

    return res.send(video);
  } catch (error) {
    return serverError(res, error, "Error deleting video!");
  }
};

export const getSingleVideoDetails = async (req, res) => {
  try {
    const video = await videoModel
      .findById(req.params.videoId)
      .select("-thumbnail -video")
      .populate("channel");
    if (!video) {
      return clientError(res, "Video Not Found!");
    }

    video.views++;
    await video.save();

    const response = {
      _id: video._id,
      title: video.title,
      description: video.description,
      category: video.category,
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      channel: video.channel,
    };

    return res.send(response);
  } catch (error) {
    return serverError(res, error, "Error fetching video details!");
  }
};

export const getVideoThumbnail = async (req, res) => {
  try {
    const video = await videoModel
      .findById(req.params.videoId)
      .select("thumbnail");

    res.set("Content-type", video.thumbnail.contentType);
    return res.send(video.thumbnail.data);
  } catch (error) {
    return serverError(res, error, "Error fetching video thumbnail!");
  }
};

export const getVideoController = async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.videoId).select("video");

    const videoBuffer = video.video.data;
    const videoSize = Buffer.from(videoBuffer).length;

    res.writeHead(200, {
      "Content-Type": video.video.contentType,
      "Content-Length": videoSize,
      "Cache-Control": "public, max-age=604800",
    });

    res.end(videoBuffer);
  } catch (error) {
    return serverError(res, error, "Error fetching video!");
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
    const { category, similarVideos, videoId, page = 1 } = req.query;
    const args = {};

    if (category || similarVideos) {
      args["category"] = category || similarVideos;
    }

    const pageSize = 6;
    const skipCount = (page - 1) * pageSize;

    const allVideos = await videoModel
      .find(args)
      .select("title channel views createdAt")
      .populate("channel")
      .skip(skipCount)
      .limit(pageSize);

    let total = await videoModel.find(args).select("title");

    let response = allVideos.map((video) => ({
      _id: video._id,
      title: video.title,
      channel: video.channel,
      views: video.views,
      createdAt: video.createdAt,
    }));

    if (videoId) {
      response = response.filter((video) => video._id.toString() !== videoId);
    }

    return res.send({ videos: response, total: total.length });
  } catch (error) {
    return serverError(res, error, "Error fetching all videos!");
  }
};

export const toggleLikeOnVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { likedId, removeLikedId } = req.query;

    let video = await videoModel.findById(videoId).select("likes");

    if (likedId) {
      video.likes.push(likedId);
    }

    if (removeLikedId) {
      video.likes = video.likes.filter((id) => id.toString() !== removeLikedId);
    }

    await video.save();

    return res.send(video.likes);
  } catch (error) {
    return serverError(res, error, "Error While Like/remove Like!");
  }
};

export const searchVideosChannels = async (req, res) => {
  try {
    let { q } = req.query;

    const videos = await videoModel
      .find({
        title: { $regex: q, $options: "i" },
      })
      .select("-thumbnail -video")
      .populate("channel");

    let videoResults = videos.map((video) => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      channel: video.channel,
      views: video.views,
      createdAt: video.createdAt,
    }));

    const channelResults = await channelModel.find({
      name: { $regex: q, $options: "i" },
    });

    res.send({ videos: videoResults, channels: channelResults });
  } catch (error) {
    return serverError(res, error, "Error while searching!");
  }
};

export const getLikedVideos = async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await videoModel
      .find({
        likes: mongoose.Types.ObjectId.createFromHexString(userId),
      })
      .select("-thumbnail -video");

    let response = videos.map((video) => ({
      _id: video.id,
      title: video.title,
      channel: video.channel,
      views: video.views,
      createdAt: video.createdAt,
    }));

    return res.send(response);
  } catch (error) {
    return serverError(res, error, "Error fetching liked videos!");
  }
};

export const updateVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId, message, messageId } = req.body;

    const video = await videoModel.findById(videoId).select("comments");
    if (!video) {
      return clientError(res, "No Video Found!");
    }

    if (messageId) {
      video.comments = video.comments.filter((mess) => mess._id != messageId);
    } else {
      if (!message) {
        return clientError(res, "Message required!");
      }

      video.comments.push({ userId: userId, message: message });
    }

    await video.save();

    return res.send(video.comments);
  } catch (error) {
    return serverError(res, "Error while commenting video!");
  }
};

export const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const allComments = await videoModel
      .findById(videoId)
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" },
      })
      .select("comments");

    return res.send(allComments);
  } catch (error) {
    return serverError(res, error, "Error fetching comments!");
  }
};
