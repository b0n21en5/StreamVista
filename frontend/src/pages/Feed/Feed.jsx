import { useEffect, useState } from "react";
import axios from "axios";
import { allCategoriesRoute, allVideosRoute } from "../../utills/apiRoutes";
import Sidebar from "../../components/Sidebar/Sidebar";
import Video from "../../components/Video/Video";
import styles from "./Feed.module.css";

const Feed = () => {
  const [fetchedData, setFetchedData] = useState({
    videos: [],
    categories: [],
  });

  const [query, setQuery] = useState({ category: "" });

  const fetchAllVideos = async () => {
    try {
      const { data } = await axios.get(
        `${allVideosRoute}?category=${query.category}`
      );
      setFetchedData((p) => ({ ...p, videos: data }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get(allCategoriesRoute);
      setFetchedData((p) => ({ ...p, categories: data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
    fetchAllVideos();
  }, []);

  useEffect(() => {
    fetchAllVideos();
  }, [query]);

  return (
    <div className={styles.feedCnt}>
      <Sidebar />

      <div>
        {/* All Categories Container */}
        <div className={styles.catCnt}>
          <div
            className={`${styles.cat} ${
              query.category === "" ? styles.catAct : ""
            }`}
            onClick={() => setQuery((p) => ({ ...p, category: "" }))}
          >
            All
          </div>
          {fetchedData.categories?.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setQuery((p) => ({ ...p, category: cat }))}
              className={`${styles.cat} ${
                query.category === cat ? styles.catAct : ""
              }`}
            >
              {cat[0].toUpperCase() + cat.substr(1)}
            </div>
          ))}
        </div>

        {/* All Videos Container */}
        <div className={styles.videosCnt}>
          {fetchedData.videos.length
            ? fetchedData.videos?.map((video) => (
                <Video video={video} key={video._id} />
              ))
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Feed;
