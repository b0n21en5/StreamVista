import ReactDOM from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { MdFileUpload, MdOutlineFeedback } from "react-icons/md";
import { LuGalleryThumbnails } from "react-icons/lu";
import { addVideoRoute, updateChannelRoute } from "../../utills/apiRoutes";
import axios from "axios";

import styles from "./UploadModal.module.css";
import { useParams } from "react-router-dom";

const UploadModal = ({ setIsVisible }) => {
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    description: "",
    video: "",
    thumbnail: "",
  });

  const { channelId } = useParams();

  useEffect(() => {
    // console.log(postData);
  }, [postData]);

  const handleAddNewVideo = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("video", postData.video);
      formData.append("thumbnail", postData.thumbnail);
      formData.append("category", postData.category);
      formData.append("description", postData.description);
      formData.append("channel", channelId);

      const newVideo = await axios.post(addVideoRoute, formData);

      if (newVideo.data) {
        const { data } = await axios.put(`${updateChannelRoute}/${channelId}`, {
          videoId: newVideo.data?._id,
        });
        console.log(data);
      }
      setIsVisible((p) => ({ ...p, upload: false }));
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.uploadModalOverlay} onClick={() => {}}>
      <form
        className={styles.uploadModal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleAddNewVideo}
      >
        {/* Top section */}
        <div className={styles.top}>
          <div className={styles.heading}>Upload video</div>
          <div className={styles.svgCnt}>
            <MdOutlineFeedback />
            <RxCross1
              onClick={() => setIsVisible((p) => ({ ...p, upload: false }))}
            />
          </div>
        </div>

        {/* Upload section */}
        <div className={styles.vidDetInpSec}>
          {/* Video upload input */}
          <div className={`${styles.fileInputCnt} `}>
            <input
              type="file"
              id="vidInput"
              className={styles.hidden}
              accept="video/*"
              onChange={(e) =>
                setPostData((p) => ({ ...p, video: event.target.files[0] }))
              }
              required
            />
            <label htmlFor="vidInput" className={styles.uploadIcon}>
              <MdFileUpload />
            </label>
            <label className={styles.uploadBtn} htmlFor="vidInput">
              SELECT VIDEO
            </label>
            <span className={styles.selectedFile}>
              {postData.video
                ? postData.video?.name?.substr(0, 15) + "..."
                : "No file chosen"}
            </span>
          </div>

          {/* Thumbnail upload input */}
          <div className={styles.fileInputCnt}>
            <input
              type="file"
              accept="image/*"
              id="thumbInput"
              className={styles.hidden}
              onChange={(e) =>
                setPostData((p) => ({ ...p, thumbnail: e.target.files[0] }))
              }
              required
            />
            <label htmlFor="thumbInput" className={styles.uploadIcon}>
              <LuGalleryThumbnails />
            </label>
            <label className={styles.uploadBtn} htmlFor="thumbInput">
              SELECT THUMBNAIL
            </label>
            <span className={styles.selectedFile}>
              {postData.thumbnail
                ? postData.thumbnail?.name?.substr(0, 20) + "..."
                : "No file chosen"}
            </span>
          </div>

          <div className={styles.vidDet}>
            <input
              type="text"
              placeholder="Enter video title"
              className={styles.title}
              onChange={(e) =>
                setPostData((p) => ({ ...p, title: e.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="Enter video category"
              className={styles.title}
              onChange={(e) =>
                setPostData((p) => ({ ...p, category: e.target.value }))
              }
              required
            />
            <textarea
              cols={56}
              rows={10}
              type="text"
              placeholder="Type video description here"
              className={styles.descriptions}
              onChange={(e) =>
                setPostData((p) => ({ ...p, description: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* Button Container */}
        <div className={styles.btnCnt}>
          <div
            className={`${styles.uploadBtn} ${styles.cancelBtn}`}
            onClick={() => setIsVisible((p) => ({ ...p, upload: false }))}
          >
            Cancel
          </div>
          <button
            type="submit"
            className={styles.uploadBtn}
            onClick={(e) => handleAddNewVideo(e)}
          >
            Upload Now
          </button>
        </div>
      </form>
    </div>,
    document.getElementById("modal-root")
  );
};

export default UploadModal;
