import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import {
  allVideosRoute,
  getVideoRoute,
  likeVideoRoute,
  profilePicRoute,
  videoDetailsRoute,
} from "../../utills/apiRoutes";
import { Link, useParams } from "react-router-dom";
import Video from "../../components/Video/Video";
import { useSelector } from "react-redux";
import Comments from "../../components/Comments/Comments";
import Subscribe from "../../components/SubscribeButton/Subscribe";
import toast from "react-hot-toast";
import { DotLoader } from "react-spinners";
import styles from "./VideoDetails.module.css";

const VideoDetails = () => {
  const [video, setVideo] = useState({});
  const [similar, setSimilar] = useState({ videos: [], isLoad: false });
  const [isDone, setIsDone] = useState({ like: false, subscribe: false });

  const { videoId } = useParams();

  const { user } = useSelector((state) => state.user);

  const fetchVideoDetails = async () => {
    try {
      const { data } = await axios.get(`${videoDetailsRoute}/${videoId}`);
      setVideo(data);

      setIsDone((p) => ({
        ...p,
        like: data?.likes.includes(user?._id) ? true : false,
        subscribe: data?.channel?.subscribers.includes(user?._id)
          ? true
          : false,
      }));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const fetchSimilarVideos = async () => {
    try {
      const { data } = await axios.get(
        `${allVideosRoute}?similarVideos=${video.category}&videoId=${videoId}`
      );
      setSimilar({ isLoad: true, videos: data.videos });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (video) fetchSimilarVideos();
  }, [video?._id]);

  const handleVideoLike = async (likeQry) => {
    try {
      const { data } = await axios.put(
        `${likeVideoRoute}/${videoId}?${likeQry}=${user?._id}`
      );
      setVideo((p) => ({ ...p, likes: data }));

      setIsDone((p) => ({
        ...p,
        like: data?.includes(user?._id) ? true : false,
      }));
      if (data)
        likeQry === "likedId"
          ? toast.success("added to liked videos!")
          : toast("removed from liked videos!");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className={styles.detCnt}>
      <div className={styles.videoCnt}>
        <ReactPlayer
          width="100%"
          url={`${getVideoRoute}/${video._id}`}
          controls
        />
        <div className={styles.videoDetails}>
          <div className={styles.title}>{video.title}</div>

          {/* Channel details section */}
          <div className={styles.ctaCnt}>
            <div className={styles.channel}>
              <Link
                to={`/channel/${video?.channel?._id}`}
                className={styles.imgCnt}
              >
                <img
                  width={40}
                  height={40}
                  src={`${profilePicRoute}/${video.channel?.userId}`}
                  alt="channel logo"
                />
              </Link>
              {/* Channel detail container */}
              <div className={styles.chaDet}>
                <Link
                  to={`/channel/${video?.channel?._id}`}
                  className={styles.title}
                >
                  {video.channel?.name}
                </Link>
                <div className={styles.subCount}>
                  {video?.channel?.subscribers?.length} subscribers
                </div>
              </div>

              {/* Subscriber button */}
              <Subscribe channelId={video?.channel?._id} />
            </div>

            <div className={styles.likes}>
              {isDone.like ? (
                <AiFillLike onClick={() => handleVideoLike("removeLikedId")} />
              ) : (
                <AiOutlineLike
                  onClick={() => {
                    if (!user) toast("Sign in to like!");
                    else handleVideoLike("likedId");
                  }}
                />
              )}
              <span>{video.likes?.length}</span>
            </div>
          </div>

          {/* Video description section */}
          <div className={styles.descriptionCnt}>
            <div className={styles.views}>{video.views} views</div>
            <div className={styles.description}>{video.description}</div>
          </div>

          {/* Comments section */}
          <Comments />
        </div>
      </div>

      <div className={styles.similarVideos}>
        {!similar.isLoad ? (
          <DotLoader color="white" />
        ) : (
          similar.videos?.map((video) => (
            <Video video={video} key={video._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default VideoDetails;
