import axios from "axios";
import { useEffect, useState } from "react";
import { channelVideosRoute, thumbnailRoute } from "../../utills/apiRoutes";
import { useParams } from "react-router-dom";
import moment from "moment";
import { LuMoreVertical } from "react-icons/lu";
import UploadModal from "../UploadModal/UploadModal";
import { SyncLoader } from "react-spinners";
import { toast } from "react-hot-toast";

import styles from "./Content.module.css";

const Content = ({ isVisible, setIsVisible }) => {
  const [channelVideos, setChannelVideos] = useState({
    data: [],
    isLoading: false,
    edit: null,
  });

  const { channelId } = useParams();

  const fetchChannelVideos = async () => {
    try {
      setChannelVideos((p) => ({ ...p, isLoading: true }));
      const { data } = await axios.get(`${channelVideosRoute}/${channelId}`);

      setChannelVideos((p) => ({ ...p, data: data, isLoading: false }));
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    if (!isVisible.upload) fetchChannelVideos();
  }, [isVisible.upload]);

  return (
    <div className={styles}>
      <div className={styles.vidCnt}>
        <div className={styles.video}>
          <div className={styles.vidLeft}>video</div>
          <div className={styles.analytics}>
            <span className={styles.date}>Date</span>
            <span className={styles.date}>Views</span>
            <span className={styles.date}>Likes</span>
          </div>
        </div>
        {channelVideos.isLoading ? (
          <SyncLoader color="white" />
        ) : (
          channelVideos.data?.map((video) => (
            <div key={video._id} className={styles.video}>
              <div className={styles.vidLeft}>
                <LuMoreVertical
                  className={styles.moreBtn}
                  onClick={() => {
                    setChannelVideos((p) => ({ ...p, edit: video }));
                    setIsVisible((p) => ({ ...p, upload: !isVisible.upload }));
                  }}
                />
                {isVisible.upload && (
                  <UploadModal
                    section="update"
                    setIsVisible={setIsVisible}
                    video={channelVideos.edit}
                  />
                )}
                <div className={styles.imgCnt}>
                  <img
                    src={`${thumbnailRoute}/${video._id}`}
                    alt="video thumbnail"
                    width={120}
                    height={60}
                  />
                </div>
                <div className={styles.det}>
                  <span>{video.title.substr(0, 30)}...</span>
                  <span className={styles.desc}>
                    {video.description.substr(0, 50)}...
                  </span>
                </div>
              </div>
              <div className={styles.analytics}>
                <span className={styles.date}>
                  {moment(video.createdAt).format("MMM DD YYYY")}
                </span>
                <span className={styles.date}>{video.views}</span>
                <span className={styles.date}>{video.likes.length}</span>
              </div>
            </div>
          ))
        )}
      </div>
      {}
    </div>
  );
};

export default Content;
