import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import axios from "axios";
import {
  allVideosRoute,
  likeVideoRoute,
  profilePicRoute,
  subscribeUserRoute,
  updateChannelRoute,
  videoDetailsRoute,
} from "../../utills/apiRoutes";
import { useParams } from "react-router-dom";
import Video from "../../components/Video/Video";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
import styles from "./VideoDetails.module.css";

const VideoDetails = () => {
  const [video, setVideo] = useState({});
  const [similarVideos, setSimilarVideos] = useState([]);

  const [isDone, setIsDone] = useState({ like: false, subscribe: false });

  const { videoId } = useParams();

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
      console.log(error);
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
      setSimilarVideos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video) fetchSimilarVideos();
  }, [video]);

  const handleVideoLike = async (likeQry) => {
    try {
      const { data } = await axios.put(
        `${likeVideoRoute}/${videoId}?${likeQry}=${user._id}`
      );
      setVideo((p) => ({ ...p, likes: data }));

      setIsDone((p) => ({
        ...p,
        like: data?.includes(user?._id) ? true : false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChannelSubscribe = async (subQry) => {
    try {
      const { data } = await axios.put(
        `${updateChannelRoute}/${video?.channel?._id}`,
        { [subQry]: user?._id }
      );

      if (data) {
        const updatedUser = await axios.put(
          `${subscribeUserRoute}/${user?._id}?${subQry}=${data._id}`
        );
        console.log(updatedUser.data);
        dispatch(setUser(updatedUser.data));
      }
      setVideo((p) => ({ ...p, channel: data }));
      setIsDone((p) => ({
        ...p,
        subscribe: data?.subscribers.includes(user?._id) ? true : false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.detCnt}>
      <div className={styles.videoCnt}>
        <ReactPlayer
          width={668}
          url={`data:${video.videoContentType};base64,${video.videoData}`}
          controls
        />
        <div className={styles.videoDetails}>
          <div className={styles.title}>{video.title}</div>

          <div className={styles.ctaCnt}>
            <div className={styles.channel}>
              <div className={styles.imgCnt}>
                <img
                  width={40}
                  height={40}
                  src={`${profilePicRoute}/${video.channel?.userId}`}
                  alt="channel logo"
                />
              </div>
              {/* Channel detail container */}
              <div>
                <span className={styles.title}>{video.channel?.name}</span>
                <div className={styles.subCount}>
                  {video?.channel?.subscribers?.length} subscribers
                </div>
              </div>

              {/* Subscriber button */}
              {isDone.subscribe ? (
                <div
                  className={`${styles.subBtn} ${styles.subscribed}`}
                  onClick={() => handleChannelSubscribe("unSubscribe")}
                >
                  <IoMdNotificationsOutline />
                  Subscribed
                  <FaAngleDown />
                </div>
              ) : (
                <div
                  className={styles.subBtn}
                  onClick={() => handleChannelSubscribe("subscribe")}
                >
                  Subscribe
                </div>
              )}
            </div>

            <div className={styles.likes}>
              {isDone.like ? (
                <AiFillLike onClick={() => handleVideoLike("removeLikedId")} />
              ) : (
                <AiOutlineLike onClick={() => handleVideoLike("likedId")} />
              )}
              <span>{video.likes?.length}</span>
            </div>
          </div>

          <div className={styles.descriptionCnt}>
            <div className={styles.views}>{video.views} views</div>
            <div className={styles.description}>{video.description}</div>
          </div>
        </div>
      </div>

      <div className={styles.similarVideos}>
        {similarVideos?.map((video) => (
          <Video video={video} key={video._id} />
        ))}
      </div>
    </div>
  );
};

export default VideoDetails;
