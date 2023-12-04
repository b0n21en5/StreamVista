import { useEffect, useState } from "react";
import axios from "axios";
import { allCategoriesRoute, allVideosRoute } from "../../utills/apiRoutes";
import Sidebar from "../../components/Sidebar/Sidebar";
import Video from "../../components/Video/Video";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";
import styles from "./Feed.module.css";

const Feed = () => {
  const [fetched, setFetched] = useState({
    videos: [],
    total: 6,
    isVideoLoad: false,
    categories: [],
  });
  const [query, setQuery] = useState({ category: "", page: 1 });

  const fetchAllVideos = async () => {
    try {
      if (fetched.videos && fetched.videos?.length < fetched.total) {
        const { data } = await axios.get(
          `${allVideosRoute}?category=${query.category}&page=${query.page}`
        );

        if (query.page === 1) {
          setFetched((p) => ({
            ...p,
            videos: data.videos,
            total: data.total,
            isVideoLoad: true,
          }));
        } else {
          setFetched((p) => ({
            ...p,
            videos: [...fetched.videos, ...data.videos],
            total: data.total,
            isVideoLoad: true,
          }));
        }
      }
    } catch (error) {
      toast(error.response.data);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get(allCategoriesRoute);
      setFetched((p) => ({ ...p, categories: data }));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    setFetched((p) => ({ ...p, total: fetched.total + 1 }));
    setQuery((p) => ({ ...p, page: 1 }));
    fetchAllVideos();
  }, [query.category]);

  useEffect(() => {
    fetchAllVideos();
  }, [query.page]);

  const handleInfiniteScrolling = () => {
    if (window.innerHeight >= window.innerHeight * 0.6) {
      setQuery((p) => ({ ...p, page: query.page + 1 }));
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", handleInfiniteScrolling);

    fetchAllCategories();
    fetchAllVideos();

    return () => {
      document.removeEventListener("scroll", handleInfiniteScrolling);
    };
  }, []);

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
          {fetched.categories?.map((cat, idx) => (
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
          {fetched.isVideoLoad ? (
            fetched.videos?.map((video) => (
              <Video video={video} key={video._id} />
            ))
          ) : (
            <FadeLoader color="white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
