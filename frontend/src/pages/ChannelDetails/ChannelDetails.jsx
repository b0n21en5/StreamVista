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
  const [fetched, setFetched] = useState({ videos: [], channel: {} });

  const { user } = useSelector((state) => state.user);

  const { channelId } = useParams();
  console.log(channelId)

  const fetchChannelDetails = async () => {
    try {
      const { data } = await axios.get(`${channelDetailsRoute}/${channelId}`);
      setFetched((p) => ({ ...p, channel: data }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      const { data } = await axios.get(
        `${channelVideosRoute}/${user?.channel?._id}`
      );
      setFetched((p) => ({ ...p, videos: data }));
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
        <div className={styles.videosCnt}>
          {fetched.videos?.map((video) => (
            <Video video={video} key={video._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelDetails;
