import { FaAngleDown } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { subscribeUserRoute, updateChannelRoute } from "../../utills/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Subscribe.module.css";

const Subscribe = ({ channelId }) => {
  const path = useLocation().pathname.split("/")[1];
  console.log(path);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

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
    <>
      {user?.subscribed?.includes(channelId) ? (
        <div
          className={`${styles.subBtn} ${styles.subscribed} ${
            path === "channel" ? styles.mt40 : styles.ml40
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleChannelSubscribe("unSubscribe", channelId);
          }}
        >
          <IoMdNotificationsOutline />
          Subscribed
          <FaAngleDown />
        </div>
      ) : (
        <div
          className={styles.subBtn}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleChannelSubscribe("subscribe", channelId);
          }}
        >
          Subscribe
        </div>
      )}
    </>
  );
};

export default Subscribe;
