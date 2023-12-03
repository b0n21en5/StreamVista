export const host =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

// user auth routes
export const registerRoute = `${host}/api/v1/users/register`;
export const loginRoute = `${host}/api/v1/users/login`;
export const resetPasswordRoute = `${host}/api/v1/users/reset-password`;
export const updateUserRoute = `${host}/api/v1/users/update-user`;
export const profilePicRoute = `${host}/api/v1/users/profile-picture`; // params: userId
export const subscribeUserRoute = `${host}/api/v1/users/subscribe`; // params: userId
export const subscribedChannelsRoute = `${host}/api/v1/users/subscribed-channels`; // params: userId
// params: userId && query: addId or removeId
export const watchLaterRoute = `${host}/api/v1/users/watch-list`;

// channel routes
export const createChannelRoute = `${host}/api/v1/channels/create`;
export const updateChannelRoute = `${host}/api/v1/channels/update`; // params: channelId
export const fetchAllChannelsRoute = `${host}/api/v1/channels/get-all`;
export const channelDetailsRoute = `${host}/api/v1/channels/channel-details`;
export const channelVideosRoute = `${host}/api/v1/channels/channel-videos`;

// video routes
export const addVideoRoute = `${host}/api/v1/videos/add-new`;
export const updateVideoRoute = `${host}/api/v1/videos/update`; // params: videoId
export const deleteVideoRoute = `${host}/api/v1/videos/delete`; // params: videoId
export const likeVideoRoute = `${host}/api/v1/videos/like`; // params: likedId or removeLikedId
export const videoDetailsRoute = `${host}/api/v1/videos/video-details`; // params: videoId
export const allCategoriesRoute = `${host}/api/v1/videos/get-categories`;
export const allVideosRoute = `${host}/api/v1/videos/get-all`; // query: category
export const searchVideosChannelsRoute = `${host}/api/v1/videos/search`; // query: q
export const likedVideosRoute = `${host}/api/v1/videos/liked-videos`; // params: userId
// param: videoid && query: userId & message or messageId
export const updateCommentsRoute = `${host}/api/v1/videos/comments`;
export const allCommentsRoute = `${host}/api/v1/videos/all-comments`; // param: videoid
