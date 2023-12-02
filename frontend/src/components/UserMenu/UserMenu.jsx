import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { profilePicRoute } from "../../utills/apiRoutes";
import { Link } from "react-router-dom";
import { TbUserSquare } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { removeUser } from "../../store/userSlice";
import { GoVideo } from "react-icons/go";
import { CiStreamOn } from "react-icons/ci";

import styles from "./UserMenu.module.css";

const UserMenu = ({ section, setIsVisible }) => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return ReactDOM.createPortal(
    <div
      className={styles.userMenuModalOverlay}
      onClick={() =>
        setIsVisible((p) => ({ ...p, menu: false, upload: false }))
      }
    >
      {section === "upload" ? (
        <div
          className={styles.uploadModal}
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to={`/studio/channel/${user?.channel?._id}`}
            className={styles.menuItem}
            onClick={() => setIsVisible((p) => ({ ...p, upload: false }))}
          >
            <GoVideo />
            <span>Upload video</span>
          </Link>
          <Link
            to=""
            className={styles.menuItem}
            onClick={() => setIsVisible((p) => ({ ...p, upload: false }))}
          >
            <CiStreamOn />
            <span>Go live</span>
          </Link>
        </div>
      ) : (
        <div
          className={`${styles.uploadModal} ${styles.userMenuModal}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.heading}>
            <div className={styles.imgCnt}>
              <img
                src={`${profilePicRoute}/${user?._id}`}
                alt="user logo"
                width={40}
                height={40}
              />
            </div>
            <div className={styles.userDet}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userName}>{user?.email}</div>
              <Link
                to={`/channel/${user?.channel?._id}`}
                onClick={() => setIsVisible((p) => ({ ...p, menu: false }))}
              >
                View your cahnnel
              </Link>
            </div>
          </div>

          <div className={styles.itemSec}>
            {!user?.isChannel && (
              <div
                className={styles.menuItem}
                onClick={() =>
                  setIsVisible((p) => ({ ...p, channel: true, menu: false }))
                }
              >
                <TbUserSquare />
                <span>Create a channel</span>
              </div>
            )}
            {user && (
              <div
                className={styles.menuItem}
                onClick={() => {
                  dispatch(removeUser());
                  setIsVisible((p) => ({ ...p, menu: false }));
                }}
              >
                <MdLogout />
                <span>Sign out</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>,
    document.getElementById("modal-root")
  );
};

export default UserMenu;
