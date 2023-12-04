import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoHome, GoHomeFill } from "react-icons/go";
import { BsCollectionPlay, BsCollectionPlayFill } from "react-icons/bs";
import styles from "./SidebarModal.module.css";

const SidebarModal = ({ setIsVisible }) => {
  const path = useLocation().pathname;

  return (
    <div
      className={styles.sidebarModalOverlay}
      onClick={() => setIsVisible((p) => ({ ...p, sidebar: false }))}
    >
      <div className={styles.sidebarModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.navLeft}>
          <RxHamburgerMenu
            className={styles.moreBtn}
            onClick={() => setIsVisible((p) => ({ ...p, sidebar: false }))}
          />
          <Link to="/" className={styles.logoCnt}>
            <img src={logo} height={20} alt="logo" />
            <span className={styles.logoText}>StreamVista</span>
          </Link>
        </div>

        {/* Sidebar items */}
        <div className={styles.sideItemsCnt}>
          <Link
            to="/"
            className={styles.sideItem}
            onClick={() => setIsVisible((p) => ({ ...p, sidebar: false }))}
          >
            {path === "/" ? <GoHomeFill /> : <GoHome />}
            <div className={styles.text}>Home</div>
          </Link>
          <Link
            to="/feed/subscriptions"
            className={styles.sideItem}
            onClick={() => setIsVisible((p) => ({ ...p, sidebar: false }))}
          >
            {path === "/feed/subscriptions" ? (
              <BsCollectionPlayFill />
            ) : (
              <BsCollectionPlay />
            )}
            <div className={styles.text}>Subscriptions</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidebarModal;
