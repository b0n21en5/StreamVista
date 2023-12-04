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
import { RxDotFilled } from "react-icons/rx";
import Subscribe from "../../components/SubscribeButton/Subscribe";
import { RingLoader, RotateLoader } from "react-spinners";

import styles from "./ChannelDetails.module.css";

const ChannelDetails = () => {
  const [fetched, setFetched] = useState({
    videos: [],
    channel: {},
    isChannelLoad: false,
    isVideosLoad: false,
  });

  const { channelId } = useParams();

  const { user } = useSelector((state) => state.user);

  const fetchChannelDetails = async () => {
    try {
      const { data } = await axios.get(`${channelDetailsRoute}/${channelId}`);
      setFetched((p) => ({ ...p, channel: data, isChannelLoad: true }));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      const { data } = await axios.get(`${channelVideosRoute}/${channelId}`);
      setFetched((p) => ({ ...p, videos: data, isVideosLoad: true }));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchChannelDetails();
    fetchChannelVideos();
  }, []);

  useEffect(() => {
    fetchChannelDetails();
  }, [user?.subscribed]);

  return (
    <div className={styles.mainCnt}>
      <Sidebar />

      <div className={styles.channelCnt}>
        <div className={styles.bannerCnt}>
          <img src={banner} alt="channel banner" height={172} width="100%" />
        </div>

        {!fetched.isChannelLoad ? (
          <RingLoader color="white" />
        ) : (
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
              <div className={styles.subCount}>
                {fetched?.channel?.subscribers?.length} subscribers
                <RxDotFilled />
                {fetched?.channel?.videos?.length} videos
              </div>
              <Subscribe channelId={fetched?.channel?._id} />
            </div>
          </div>
        )}

        {/* Channel video container */}
        {!fetched.isVideosLoad ? (
          <RingLoader color="white" />
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
