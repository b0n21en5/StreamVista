import { clientError, serverError } from "../helpers/handleErrors.js";
import channelModel from "../models/channelModel.js";

export const createChannelController = async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name) return clientError(res, "Channel Name required!");
    if (!userId) return clientError(res, "User Id required!");

    const newChannel = await channelModel(req.body).save();

    return res.send(newChannel);
  } catch (error) {
    return serverError(res, error, "Error creating new channel!");
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    if (!channelId) return clientError(res, "Channel Id required!");

    const channel = await channelModel.findById(channelId);
    if (!channel) return clientError(res, "No Channel Found!");

    const { name, videoId, removeVideoId, subscribe, unSubscribe } = req.body;

    if (name) {
      channel.name = name;
    }

    if (videoId) {
      channel.videos.push(videoId);
    }

    if (removeVideoId) {
      channel.videos = channel.videos.filter(
        (videoid) => videoid.toString() !== removeVideoId
      );
    }

    if (subscribe) {
      channel.subscribers.push(subscribe);
    }

    if (unSubscribe) {
      channel.subscribers = channel.subscribers.filter(
        (userId) => userId.toString() !== unSubscribe
      );
    }

    const updatedChannel = await channel.save();

    return res.send(updatedChannel);
  } catch (error) {
    return serverError(res, error, "Error updating channel!");
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const allChannels = await channelModel.find();

    return res.send(allChannels);
  } catch (error) {
    return serverError(res, error, "Error fetching all channels!");
  }
};

export const getChannelDetails = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await channelModel.findById(channelId);
    if (!channel) {
      return clientError(res, "No Channel Found!");
    }

    return res.send(channel);
  } catch (error) {
    return serverError(res, error, "Error while fetching channel details!");
  }
};

export const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await channelModel
      .findById(channelId)
      .populate({ path: "videos", select: "-thumbnail -video" });
    if (!channel) {
      return clientError(res, "No Channel Found!");
    }

    const response = channel.videos.map((video) => ({
      _id: video._id,
      title: video.title,
      channel: video.channel,
      category: video.category,
      views: video.views,
      likes: video.likes,
      createdAt: video.createdAt,
      description: video.description,
    }));

    return res.send(response);
  } catch (error) {
    return serverError(res, error, "Error fetching channel videos!");
  }
};
