import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  allChannelsRoute,
  profilePicRoute,
  subscribedChannelsRoute,
} from "../../utills/apiRoutes";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Subscribe from "../../components/SubscribeButton/Subscribe";
import { BounceLoader } from "react-spinners";

import styles from "./Subscriptions.module.css";

const Subscriptions = () => {
  const [subscribed, setSubscribed] = useState({ channels: [], isLoad: false });

  const { user } = useSelector((state) => state.user);

  const fetchAllSubscribedChannels = async () => {
    try {
      const { data } = await axios.get(
        `${subscribedChannelsRoute}/${user?._id}`
      );
      if (data?.length) {
        setSubscribed((p) => ({ ...p, channels: data, isLoad: true }));
      } else {
        fetchAllChannels();
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchAllChannels = async () => {
    try {
      const { data } = await axios.get(allChannelsRoute);
      setSubscribed((p) => ({ ...p, channels: data, isLoad: true }));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllSubscribedChannels();
    } else {
      fetchAllChannels();
    }
  }, []);

  return (
    <div className={styles.mainCnt}>
      <Sidebar />
      <div className={styles.allChannels}>
        {!subscribed.isLoad ? (
          <BounceLoader color="white" />
        ) : (
          subscribed.channels.map((channel) => (
            <Link
              to={`/channel/${channel._id}`}
              key={channel._id}
              className={styles.channel}
            >
              <div className={styles.avatarSec}>
                <img
                  src={`${profilePicRoute}/${channel.userId}`}
                  width={136}
                  height={136}
                  alt="channel logo"
                />
              </div>

              {/* Channel details */}
              <div className={styles.det}>
                <div className={styles.channelName}>{channel.name}</div>
                <div className={styles.subCount}>
                  {channel.subscribers?.length} subscribers
                </div>
              </div>

              {/* Subscribe button */}
              <Subscribe channelId={channel?._id} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
