import { Link, useLocation, useParams } from "react-router-dom";
import { profilePicRoute } from "../../utills/apiRoutes";
import moment from "moment";
import styles from "./Video.module.css";
import { LuDot } from "react-icons/lu";

const Video = ({ video }) => {
  const path = useLocation().pathname.split("/")[1];

  return (
    <Link
      to={`/watch/${video._id}`}
      className={`${styles.video} ${
        path === "" ? "" : path === "watch" ? styles.simVid : styles.chaVid
      }`}
    >
      <div className={styles.imgCnt}>
        <img
          src={`data:${video.thumbnailContentType};base64,${video.thumbnailData}`}
          width={371}
          alt="video thumbnail"
        />
      </div>

      <div className={styles.vidInfoCnt}>
        {path === "" && (
          <div className={styles.logoCnt}>
            <img
              src={`${profilePicRoute}/${video.channel?.userId}`}
              width={35}
              alt="channel logo"
            />
          </div>
        )}
        <div className={styles.videoInfo}>
          <div className={styles.title}>
            {video.title.substr(0, 60) +
              `${video.title.length > 60 ? "..." : ""}`}
          </div>
          <div className={styles.channel}>{video.channel?.name}</div>
          <div className={styles.channel}>
            {video.views} views
            <LuDot />
            {moment(video.createdAt).fromNow()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Video;
