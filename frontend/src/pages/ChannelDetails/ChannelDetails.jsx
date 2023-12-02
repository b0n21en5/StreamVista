import Sidebar from "../../components/Sidebar/Sidebar";
import banner from "../../assets/ch-banner.jpg";
import {
  channelDetailsRoute,
  channelVideosRoute,
  profilePicRoute,
} from "../../utills/apiRoutes";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import Video from "../../components/Video/Video";
import { useParams } from "react-router-dom";

import styles from "./ChannelDetails.module.css";

const ChannelDetails = () => {
  const [fetched, setFetched] = useState({
    videos: [],
    channel: {},
    isLoad: false,
  });

  const { channelId } = useParams();

  const fetchChannelDetails = async () => {
    try {
      setFetched((p) => ({ ...p, isLoad: true }));
      const { data } = await axios.get(`${channelDetailsRoute}/${channelId}`);
      setFetched((p) => ({ ...p, channel: data, isLoad: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      setFetched((p) => ({ ...p, isLoad: true }));
      const { data } = await axios.get(`${channelVideosRoute}/${channelId}`);
      setFetched((p) => ({ ...p, videos: data, isLoad: false }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChannelDetails();
    fetchChannelVideos();
  }, []);

  return (
    <div className={styles.mainCnt}>
      <Sidebar />

      <div className={styles.channelCnt}>
        <div className={styles.bannerCnt}>
          <img src={banner} alt="channel banner" height={172} width="100%" />
        </div>

        <div className={styles.channelDet}>
          {/* Channel logo */}
          <div className={styles.logoCnt}>
            <img
              src={`${profilePicRoute}/${fetched?.channel?.userId}`}
              alt="channel logo"
              width={160}
              height={160}
            />
          </div>

          {/* Channel details */}
          <div className={styles.detCnt}>
            <div className={styles.name}>{fetched?.channel?.name}</div>
          </div>
        </div>

        {/* Channel video containr */}
        {fetched.isLoad ? (
          "Loading..."
        ) : (
          <div className={styles.videosCnt}>
            {fetched.videos?.map((video) => (
              <Video video={video} key={video._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelDetails;
