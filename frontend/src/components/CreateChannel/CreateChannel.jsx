import ReactDOM from "react-dom";
import {
  createChannelRoute,
  profilePicRoute,
  updateUserRoute,
} from "../../utills/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useEffect, useState } from "react";

import styles from "./CreateChannel.module.css";
import { setUser } from "../../store/userSlice";

const CreateChannel = ({ setIsVisible }) => {
  const [postData, setPostData] = useState({
    name: "",
    email: "",
    userId: "",
    pic: "",
  });

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && postData.name === "" && postData.userId === "") {
      setPostData((p) => ({
        ...p,
        name: user?.name,
        email: user?.email,
        userId: user?._id,
      }));
    }
  }, [user]);

  const handleCreatingChannel = async () => {
    try {
      const newChannel = await axios.post(createChannelRoute, postData);

      if (newChannel.data._id) {
        const formData = new FormData();
        formData.append("name", user?.name);
        formData.append("email", user?.email);
        formData.append("channel", newChannel.data?._id);
        if (postData.pic) {
          formData.append("pic", postData.pic);
        }

        const { data } = await axios.put(updateUserRoute, formData);
        dispatch(setUser(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputFields = (fieldName, e) => {
    if (fieldName === "pic") {
      setPostData((p) => ({ ...p, pic: e.target.files[0] }));
    } else {
      setPostData((p) => ({ ...p, [fieldName]: e.target.value }));
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>
          <span>How you'll appear</span>
          <RxCross2
            onClick={() => setIsVisible((p) => ({ ...p, channel: false }))}
          />
        </h2>

        <div className={styles.channelDet}>
          <div>&nbsp;</div>

          <div className={styles.imgCnt}>
            <img
              src={`${profilePicRoute}/${user?._id}`}
              alt="user logo"
              width={120}
              height={120}
            />
            <input
              type="file"
              placeholder="Upload picture"
              onChange={(e) => handleInputFields("pic", e)}
            />
          </div>

          <div>
            <div className={styles.inputCnt}>
              <label>Name</label>
              <input
                type="text"
                value={postData?.name}
                onChange={(e) => handleInputFields("name", e)}
                required
              />
            </div>
            <div className={styles.inputCnt}>
              <label>Handle</label>
              <input
                type="text"
                value={postData?.email}
                onChange={(e) => handleInputFields("email", e)}
                disabled
              />
            </div>
          </div>

          <div className={styles.terms}>
            By clicking Create channel, you agree to{" "}
            <span className={styles.links}>YouTube's Terms of Service.</span>
            Changes made to your name and profile picture are visible only on
            YouTube and not other Google services.{" "}
            <span className={styles.links}>Learn more</span>
          </div>

          <div className={styles.btnCnt}>
            <div
              className={styles.btn}
              onClick={() => setIsVisible((p) => ({ ...p, channel: false }))}
            >
              Cancel
            </div>
            <div
              className={`${styles.btn} ${styles.submitBtn}`}
              onClick={() => {
                handleCreatingChannel();
                setIsVisible((p) => ({ ...p, channel: false }));
              }}
            >
              Create channel
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default CreateChannel;
