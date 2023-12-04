import { FaAngleDown } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { subscribeUserRoute, updateChannelRoute } from "../../utills/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./Subscribe.module.css";

const Subscribe = ({ channelId }) => {
  const path = useLocation().pathname.split("/")[1];

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
        if (updatedUser.data) toast.success("channel subscribed!");
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <>
      {user?.subscribed?.includes(channelId) ? (
        <div
          className={`${styles.subBtn} ${styles.subscribed} ${
            path === "channel" ? styles.mt : styles.ml
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
          className={`${styles.subBtn} ${
            path === "channel" ? styles.mt : styles.ml
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            user
              ? handleChannelSubscribe("subscribe", channelId)
              : toast("Sign in to Subscribe!");
          }}
        >
          Subscribe
        </div>
      )}
    </>
  );
};

export default Subscribe;
