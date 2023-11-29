import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import {
  allVideosRoute,
  likeVideoRoute,
  profilePicRoute,
  videoDetailsRoute,
} from "../../utills/apiRoutes";
import { useParams } from "react-router-dom";
import Video from "../../components/Video/Video";
import { useSelector } from "react-redux";
import styles from "./VideoDetails.module.css";

const VideoDetails = () => {
  const [video, setVideo] = useState({});
  const [similarVideos, setSimilarVideos] = useState([]);

  const [isLiked, setIsLiked] = useState(false);

  const { videoId } = useParams();

  const { user } = useSelector((state) => state.user);

  const fetchVideoDetails = async () => {
    try {
      const { data } = await axios.get(`${videoDetailsRoute}/${videoId}`);
      setVideo(data);
      if (data.likes.includes(user._id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
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
      if (data.includes(user._id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
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
                  src={`${profilePicRoute}/${video.channel?.userId}`}
                  alt="channel logo"
                />
              </div>
              <span className={styles.title}>{video.channel?.name}</span>
            </div>
            <div className={styles.likes}>
              {isLiked ? (
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
