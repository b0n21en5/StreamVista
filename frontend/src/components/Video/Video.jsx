import { Link, useLocation, useParams } from "react-router-dom";
import { profilePicRoute, thumbnailRoute } from "../../utills/apiRoutes";
import moment from "moment";
import { RxDotFilled } from "react-icons/rx";
import { RiMore2Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import UserMenu from "../UserMenu/UserMenu";
import styles from "./Video.module.css";

const Video = ({ video }) => {
  const [isVisible, setIsVisible] = useState({ confirm: false });
  const [mbScrn, setMbScrn] = useState(true);

  const path = useLocation().pathname.split("/")[1];

  useEffect(() => {
    if (window.innerWidth > 440) {
      setMbScrn(false);
    }
  }, [window.innerWidth]);

  return (
    <Link
      to={`/watch/${video._id}`}
      className={`${styles.video} ${
        path === ""
          ? ""
          : path === "watch"
          ? !mbScrn && styles.simVid
          : path === "channel" || path === "feed"
          ? styles.chaVid
          : !mbScrn && styles.search
      }`}
    >
      <div className={styles.imgCnt}>
        <img
          src={`${thumbnailRoute}/${video._id}`}
          width={371}
          height={209}
          alt="video thumbnail"
        />
      </div>

      <div className={styles.vidInfoCnt}>
        {path === "" && (
          <Link
            to={`/channel/${video.channel?._id}`}
            className={styles.logoCnt}
          >
            <img
              src={`${profilePicRoute}/${video.channel?.userId}`}
              width={35}
              height={35}
              alt="channel logo"
            />
          </Link>
        )}
        <div className={styles.videoInfo}>
          <div className={styles.title}>
            <span>
              {path === "search"
                ? video.title
                : video.title.substr(0, 60) +
                  `${video.title.length > 60 ? "..." : ""}`}
            </span>
            <RiMore2Fill
              className={styles.moreBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVisible((p) => ({ ...p, confirm: !isVisible.confirm }));
              }}
            />
            {isVisible.confirm && (
              <UserMenu
                section="more"
                setIsVisible={setIsVisible}
                videoId={video?._id}
              />
            )}
          </div>
          {path !== "search" && (
            <Link
              to={`/channel/${video.channel?._id}`}
              className={styles.channel}
            >
              {video.channel?.name}
            </Link>
          )}
          <div className={styles.channel}>
            {video.views} views
            <RxDotFilled />
            {moment(video.createdAt).fromNow()}
          </div>

          {/* channel logo for search page */}
          {path === "search" && (
            <>
              <div className={styles.searchChannel}>
                <div className={styles.logoCnt}>
                  <img
                    src={`${profilePicRoute}/${video.channel?.userId}`}
                    width={25}
                    height={25}
                    alt="channel logo"
                  />
                </div>
                <div className={styles.channel}>{video.channel?.name}</div>
              </div>
              {!mbScrn && (
                <div className={styles.vidDesc}>
                  {video.description.substr(0, 120) + "..."}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Video;
