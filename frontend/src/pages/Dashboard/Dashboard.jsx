import { useSelector } from "react-redux";
import { profilePicRoute } from "../../utills/apiRoutes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import {
  MdAnalytics,
  MdInsertComment,
  MdOutlineAnalytics,
  MdOutlineComment,
  MdOutlineSubtitles,
  MdSubtitles,
} from "react-icons/md";
import {
  PiMagicWandFill,
  PiMagicWandLight,
  PiVideoFill,
  PiVideoLight,
} from "react-icons/pi";
import { FaCopyright, FaRegCopyright } from "react-icons/fa6";
import uploadImg from "../../assets/upload.svg";
import UploadModal from "../../components/UploadModal/UploadModal";
import styles from "./dashboard.module.css";
import Content from "../../components/Content/Content";

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [isVisible, setIsVisible] = useState({ upload: false });

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user?.isChannel) {
      navigate("/accounts/signin");
    }
  }, [user]);

  return (
    <div className={styles.dashCnt}>
      <div className={styles.leftCnt}>
        {/* channel info container */}
        <div className={styles.top}>
          <div className={styles.logoCnt}>
            <img
              src={`${profilePicRoute}/${user?._id}`}
              alt="channel logo"
              width={100}
              height={100}
            />
          </div>
          <div className={styles.nameCnt}>
            <span>Your channel</span>
            <span className={styles.name}>{user?.channel?.name}</span>
          </div>
        </div>

        <div className={styles.linksCnt}>
          <div
            className={`${styles.linkItem} ${
              activeLink === "dashboard" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("dashboard")}
          >
            {activeLink === "dashboard" ? (
              <RiDashboardFill />
            ) : (
              <RiDashboardLine />
            )}
            <span>Dashboard</span>
          </div>
          <div
            className={`${styles.linkItem} ${
              activeLink === "content" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("content")}
          >
            {activeLink === "content" ? <PiVideoFill /> : <PiVideoLight />}
            <span>Content</span>
          </div>
          <div
            className={`${styles.linkItem} ${
              activeLink === "analytics" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("analytics")}
          >
            {activeLink === "analytics" ? (
              <MdAnalytics />
            ) : (
              <MdOutlineAnalytics />
            )}
            <span>Analytics</span>
          </div>
          <div
            className={`${styles.linkItem} ${
              activeLink === "subtitles" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("subtitles")}
          >
            {activeLink === "subtitles" ? (
              <MdSubtitles />
            ) : (
              <MdOutlineSubtitles />
            )}
            <span>Subtitles</span>
          </div>
          <div
            className={`${styles.linkItem} ${
              activeLink === "comments" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("comments")}
          >
            {activeLink === "comments" ? (
              <MdInsertComment />
            ) : (
              <MdOutlineComment />
            )}
            <span>Comments</span>
          </div>
          <div
            className={`${styles.linkItem} ${
              activeLink === "copright" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("copright")}
          >
            {activeLink === "copright" ? <FaCopyright /> : <FaRegCopyright />}
            <span>Copyright</span>
          </div>
          <div
            className={`${styles.linkItem} ${
              activeLink === "customization" ? styles.active : ""
            }`}
            onClick={() => setActiveLink("customization")}
          >
            {activeLink === "customization" ? (
              <PiMagicWandFill />
            ) : (
              <PiMagicWandLight />
            )}
            <span>Customization</span>
          </div>
        </div>
      </div>

      {/* Right Container section */}
      <div className={styles.rightCnt}>
        <div className={styles.rightHeading}>Channel {activeLink}</div>

        <div className={styles.itemCnt}>
          {/* Video upload container */}
          {activeLink === "dashboard" && (
            <div className={styles.item}>
              <img
                src={uploadImg}
                width="150"
                height="150"
                alt="upload video image"
              />
              <div className={styles.uploadTxt}>
                Want to see metrics on your recent video? Upload and publish a
                video to get started.
              </div>

              {/* Upload button */}
              <div
                className={styles.uploadBtn}
                onClick={() => setIsVisible((p) => ({ ...p, upload: true }))}
              >
                UPLOAD VIDEO
              </div>
              {isVisible.upload && (
                <UploadModal
                  setIsVisible={setIsVisible}
                  navigateContent={() => setActiveLink("content")}
                />
              )}
            </div>
          )}

          {activeLink === "content" && (
            <Content isVisible={isVisible} setIsVisible={setIsVisible} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
