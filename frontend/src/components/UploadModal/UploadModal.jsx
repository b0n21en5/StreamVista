import ReactDOM from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { MdFileUpload, MdOutlineFeedback } from "react-icons/md";
import { LuGalleryThumbnails } from "react-icons/lu";
import {
  addVideoRoute,
  deleteVideoRoute,
  getVideoRoute,
  thumbnailRoute,
  updateChannelRoute,
  updateVideoRoute,
  videoDetailsRoute,
} from "../../utills/apiRoutes";
import axios from "axios";

import styles from "./UploadModal.module.css";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UploadModal = ({
  section = "",
  setIsVisible,
  video,
  navigateContent,
}) => {
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    description: "",
    video: "",
    thumbnail: "",
  });
  const [previewUrl, setPreviewUrl] = useState({ video: "", thumbnail: "" });

  const { channelId } = useParams();

  const handleAddNewVideo = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      if (postData.video) {
        formData.append("video", postData.video);
      }
      if (postData.thumbnail) {
        formData.append("thumbnail", postData.thumbnail);
      }
      formData.append("category", postData.category);
      formData.append("description", postData.description);
      formData.append("channel", channelId);

      const newVideo =
        section === ""
          ? await axios.post(addVideoRoute, formData)
          : await axios.put(updateVideoRoute, formData);

      if (newVideo.data) {
        const { data } = await axios.put(`${updateChannelRoute}/${channelId}`, {
          videoId: newVideo.data?._id,
        });
        if (data) toast.success("video added!");
      }
      navigateContent(); // navigating to content section
      setIsVisible((p) => ({ ...p, upload: false }));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    if (file) {
      // Using FileReader to read the file and generate a preview URL
      const reader = new FileReader();

      reader.onloadend = () => {
        setPostData((p) => ({ ...p, [fieldName]: file }));
        setPreviewUrl((p) => ({ ...p, [fieldName]: reader.result }));
      };

      reader.readAsDataURL(file);
    }
  };

  const fetchVideoDetails = async () => {
    try {
      const { data } = await axios.get(`${videoDetailsRoute}/${video._id}`);

      setPreviewUrl({
        video: `${getVideoRoute}/${data._id}`,
        thumbnail: `${thumbnailRoute}/${video._id}`,
      });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (video) {
      setPostData({
        title: video.title,
        description: video.description,
        category: video.category,
        video: "",
        thumbnail: "",
      });

      fetchVideoDetails();
    }
  }, [video]);

  const handleDeleteVideo = async () => {
    try {
      const deletedvideo = await axios.delete(
        `${deleteVideoRoute}/${video._id}`
      );
      if (deletedvideo.data) {
        const { data } = await axios.put(`${updateChannelRoute}/${channelId}`, {
          removeVideoId: deletedvideo.data?._id,
        });
        if (data) toast.success("video deleted!");
      }
      setIsVisible((p) => ({ ...p, upload: false }));
    } catch (error) {
      toast.error(error.response.data);
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
              onChange={(e) => handleFileChange(e, "video")}
              required
            />
            {previewUrl.video ? (
              <video controls width="200" height="200">
                <source src={previewUrl.video} type={postData.video.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <label htmlFor="vidInput" className={styles.uploadIcon}>
                <MdFileUpload />
              </label>
            )}
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
              onChange={(e) => handleFileChange(e, "thumbnail")}
              required
            />
            {previewUrl.thumbnail ? (
              <img
                src={previewUrl.thumbnail}
                width={200}
                height={200}
                alt="thumbnail preview"
              />
            ) : (
              <label htmlFor="thumbInput" className={styles.uploadIcon}>
                <LuGalleryThumbnails />
              </label>
            )}
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
              value={postData?.title}
              required
            />
            <input
              type="text"
              placeholder="Enter video category"
              className={styles.title}
              onChange={(e) =>
                setPostData((p) => ({ ...p, category: e.target.value }))
              }
              value={postData?.category}
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
              value={postData?.description}
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
            {section === "" ? "Upload Now" : "Update Video"}
          </button>
          {section !== "" && (
            <button
              type="submit"
              className={`${styles.uploadBtn} ${styles.deleteBtn}`}
              onClick={(e) => handleDeleteVideo(e)}
            >
              Delete Video
            </button>
          )}
        </div>
      </form>
    </div>,
    document.getElementById("modal-root")
  );
};

export default UploadModal;
