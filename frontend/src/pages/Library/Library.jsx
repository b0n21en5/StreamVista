import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import axios from "axios";
import { MdOutlineWatchLater } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import {
  likedVideosRoute,
  profilePicRoute,
  watchLaterRoute,
} from "../../utills/apiRoutes";
import Video from "../../components/Video/Video";
import { Link } from "react-router-dom";

import styles from "./Library.module.css";

const Library = () => {
  const [fetched, setFetched] = useState({
    isWatchLoad: false,
    watchLater: [],
    isLikeLoad: false,
    liked: [],
  });

  const { user } = useSelector((state) => state.user);

  const fetchWatchLaterVideos = async () => {
    try {
      const { data } = await axios.get(`${watchLaterRoute}/${user?._id}`);
      console.log(data);
      setFetched((p) => ({ ...p, isWatchLoad: true, watchLater: data }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikedVideos = async () => {
    try {
      const { data } = await axios.get(`${likedVideosRoute}/${user?._id}`);
      setFetched((p) => ({ ...p, isLikeLoad: true, liked: data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWatchLaterVideos();
    fetchLikedVideos();
  }, []);

  return (
    <div className={styles.libCnt}>
      <Sidebar />

      <div className={styles.page}>
        {/* Account details */}
        <div className={styles.userDet}>
          <div className={styles.logoCnt}>
            <img
              src={`${profilePicRoute}/${user?._id}`}
              width={120}
              height={120}
              alt="channel logo"
            />
          </div>

          <div className={styles.det}>
            <div className={styles.name}>{user?.channel?.name}</div>
            <div className={styles}>{user?.email}</div>
            <Link to={`/channel/${user?.channel}`}>View Channel</Link>
          </div>
        </div>

        {/* Watch later section */}
        <div className={styles.likesCnt}>
          <div className={styles.heading}>
            <MdOutlineWatchLater />
            <span className={styles.txt}>Watch later</span>
            <span>{fetched.watchLater?.length}</span>
          </div>

          {fetched.isWatchLoad ? (
            <div className={styles.likedVidCnt}>
              {fetched.watchLater?.map((vid) => (
                <Video video={vid} />
              ))}
            </div>
          ) : (
            "Loading..."
          )}
        </div>

        {/* Likes section */}
        <div className={styles.likesCnt}>
          <div className={styles.heading}>
            <BiLike />
            <span className={styles.txt}>Liked videos</span>
            <span>{fetched.liked?.length}</span>
          </div>

          {fetched.isLikeLoad ? (
            <div className={styles.likedVidCnt}>
              {fetched.liked?.map((vid) => (
                <Video video={vid} />
              ))}
            </div>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
