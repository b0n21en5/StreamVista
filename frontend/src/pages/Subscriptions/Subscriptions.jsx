import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  profilePicRoute,
  subscribeUserRoute,
  subscribedChannelsRoute,
  updateChannelRoute,
} from "../../utills/apiRoutes";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { setUser } from "../../store/userSlice";
import { Link } from "react-router-dom";

import styles from "./Subscriptions.module.css";

const Subscriptions = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchAllSubscribedChannels = async () => {
    try {
      const { data } = await axios.get(
        `${subscribedChannelsRoute}/${user?._id}`
      );
      console.log(data);
      setSubscribedChannels(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllSubscribedChannels();
  }, []);

  const handleChannelSubscribe = async (subQry, channelId) => {
    try {
      const { data } = await axios.put(`${updateChannelRoute}/${channelId}`, {
        [subQry]: user?._id,
      });

      if (data) {
        const updatedUser = await axios.put(
          `${subscribeUserRoute}/${user?._id}?${subQry}=${data._id}`
        );
        dispatch(setUser(updatedUser.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.mainCnt}>
      <Sidebar />
      <div className={styles.allChannels}>
        {subscribedChannels.map((channel) => (
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
            {user?.subscribed?.includes(channel._id) ? (
              <div
                className={`${styles.subBtn} ${styles.subscribed}`}
                onClick={() =>
                  handleChannelSubscribe("unSubscribe", channel._id)
                }
              >
                <IoMdNotificationsOutline />
                Subscribed
                <FaAngleDown />
              </div>
            ) : (
              <div
                className={styles.subBtn}
                onClick={() => handleChannelSubscribe("subscribe", channel._id)}
              >
                Subscribe
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
