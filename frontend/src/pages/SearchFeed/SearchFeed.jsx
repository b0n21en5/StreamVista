import { useEffect, useState } from "react";
import {
  allVideosRoute,
  profilePicRoute,
  searchVideosChannelsRoute,
} from "../../utills/apiRoutes";
import Video from "../../components/Video/Video";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Subscribe from "../../components/SubscribeButton/Subscribe";
import toast from "react-hot-toast";
import { RiseLoader } from "react-spinners";

import styles from "./SearchFeed.module.css";

const SearchFeed = () => {
  const [results, setResults] = useState({
    videos: [],
    channels: [],
    isLoad: false,
    search: 1,
  });

  const { query } = useParams();

  const searchVideosAndChannels = async () => {
    try {
      setResults((p) => ({ ...p, isLoad: true }));
      const { data } = await axios.get(
        `${searchVideosChannelsRoute}?q=${query}`
      );
      setResults({
        videos: data.videos,
        channels: data.channels,
        search: 1,
      });

      if (!data.videos.length && !data.channels.lngth) {
        const allVideos = await axios.get(allVideosRoute);
        setResults((p) => ({ ...p, videos: allVideos.data, search: 0 }));
      }

      setResults((p) => ({ ...p, isLoad: false }));
    } catch (error) {
      toast(error.response.data);
    }
  };

  useEffect(() => {
    searchVideosAndChannels();
  }, [query]);

  return (
    <div className={styles.mainCnt}>
      <Sidebar />

      <div className={styles.filterCnt}>
        <div className={styles.filter}></div>
      </div>

      <div className={styles.resultsCnt}>
        {results.isLoad ? (
          <div className={styles.loader}>
            <RiseLoader color="white" />
          </div>
        ) : (
          <>
            {/* Search channel results conatiner */}
            {results.channels.length ? (
              <div className={styles.channelsCnt}>
                {results?.channels?.map((channel) => (
                  <Link
                    to={`/channel/${channel._id}`}
                    key={channel._id}
                    className={`${styles.channel} ${styles.bdBtm}`}
                  >
                    <div className={styles.imgCnt}>
                      <img
                        src={`${profilePicRoute}/${channel.userId}`}
                        width={136}
                        height={136}
                        alt="channel logo"
                      />
                    </div>

                    <div className={styles.info}>
                      <div className={styles.channelName}>{channel.name}</div>
                      <div className={styles.subCount}>
                        {channel.subscribers?.length} subscribers
                      </div>
                    </div>

                    {/* Subscribe button */}
                    <Subscribe channelId={channel._id} />
                  </Link>
                ))}
              </div>
            ) : (
              ""
            )}

            {/* Search video results container */}
            {results.videos.length ? (
              <div className={`${styles.videosCnt} ${styles.bdBtm}`}>
                {!results?.search && <h3>For you</h3>}
                {results?.videos?.map((video) => (
                  <Video key={video._id} video={video} />
                ))}
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchFeed;
