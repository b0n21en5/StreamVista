import { Link, useLocation } from "react-router-dom";
import { LuPlaySquare } from "react-icons/lu";
import { GoHome, GoHomeFill } from "react-icons/go";
import { AiFillPlaySquare } from "react-icons/ai";
import { BsCollectionPlay, BsCollectionPlayFill } from "react-icons/bs";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const path = useLocation().pathname;

  return (
    <div className={styles.sidebarCnt}>
      <Link to="/" className={styles.sideItem}>
        {path === "/" ? <GoHomeFill /> : <GoHome />}
        <div className={styles.text}>Home</div>
      </Link>
      <Link to="/feed/subscriptions" className={styles.sideItem}>
        {path === "/feed/subscriptions" ? (
          <BsCollectionPlayFill />
        ) : (
          <BsCollectionPlay />
        )}
        <div className={styles.text}>Subscriptions</div>
      </Link>
      <Link to="" className={styles.sideItem}>
        {path === "/feed/you" ? <AiFillPlaySquare /> : <LuPlaySquare />}
        <div className={styles.text}>You</div>
      </Link>
    </div>
  );
};

export default Sidebar;
