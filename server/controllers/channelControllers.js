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

    const { name, videoId, removeVideoId } = req.body;

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
    const channel = await channelModel.findById(channelId).populate("videos");
    if (!channel) {
      return clientError(res, "No Channel Found!");
    }

    const response = channel.videos.map((video) => ({
      _id: video.id,
      title: video.title,
      thumbnailData: video.thumbnail.data.toString("base64"),
      thumbnailContentType: video.thumbnail.type,
      channel: video.channel,
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
