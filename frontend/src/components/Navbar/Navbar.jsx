import { GoSearch } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { profilePicRoute } from "../../utills/apiRoutes";
import { RiVideoAddLine } from "react-icons/ri";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className={styles.navCnt}>
      <div className={styles.navLeft}>
        <RxHamburgerMenu className={styles.moreBtn} />
        <Link to="/" className={styles.logoCnt}>
          <img src={logo} height={20} alt="logo" />
          <span className={styles.logoText}>StreamVista</span>
        </Link>
      </div>

      <div className={styles.searchCnt}>
        <div className={styles.searchBar}>
          <input type="text" name="" id="" />
        </div>
        <div className={styles.searchIcon}>
          <GoSearch />
        </div>
      </div>

      <div className={styles.userCnt}>
        {!user ? (
          <Link to="/accounts/signin" className={styles.signInCnt}>
            <FaRegUserCircle />
            Sign in
          </Link>
        ) : (
          <div className={styles.user}>
            <RiVideoAddLine />
            <div className={styles.imgCnt}>
              <img
                src={`${profilePicRoute}/${user?._id}`}
                width={32}
                height={32}
                alt=""
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
