import { GoSearch } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { profilePicRoute } from "../../utills/apiRoutes";
import { RiVideoAddFill, RiVideoAddLine } from "react-icons/ri";
import { useState } from "react";
import styles from "./Navbar.module.css";
import UserMenu from "../UserMenu/UserMenu";
import CreateChannel from "../CreateChannel/CreateChannel";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState({
    menu: false,
    channel: false,
    upload: false,
  });

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
            {user.isChannel && isVisible.upload ? (
              <RiVideoAddFill
                onClick={() =>
                  setIsVisible((p) => ({ ...p, upload: !isVisible.upload }))
                }
              />
            ) : (
              <RiVideoAddLine
                onClick={() =>
                  setIsVisible((p) => ({ ...p, upload: !isVisible.upload }))
                }
              />
            )}

            <div
              className={styles.imgCnt}
              onClick={() =>
                setIsVisible((p) => ({ ...p, menu: !isVisible.menu }))
              }
            >
              <img
                src={`${profilePicRoute}/${user?._id}`}
                width={32}
                height={32}
                alt=""
              />
            </div>

            {isVisible.menu && (
              <UserMenu section="profile" setIsVisible={setIsVisible} />
            )}
            {isVisible.upload && (
              <UserMenu section="upload" setIsVisible={setIsVisible} />
            )}
            {isVisible.channel && <CreateChannel setIsVisible={setIsVisible} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
