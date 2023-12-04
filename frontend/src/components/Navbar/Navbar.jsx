import { GoSearch } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { profilePicRoute } from "../../utills/apiRoutes";
import { RiVideoAddFill, RiVideoAddLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import UserMenu from "../UserMenu/UserMenu";
import CreateChannel from "../CreateChannel/CreateChannel";
import { IoMdNotificationsOutline } from "react-icons/io";
import SidebarModal from "../SidebarModal/SidebarModal";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState({
    menu: false,
    channel: false,
    upload: false,
    sidebar: false,
  });
  const [search, setSearch] = useState({ query: "", isActive: false });
  const [mbScrn, setMbScrn] = useState(true);

  const inputRef = useRef(null);

  const { user } = useSelector((state) => state.user);

  const match = useMatch("/search/:query");

  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth > 440) {
      setMbScrn(false);
    }
  }, [window.innerWidth]);

  useEffect(() => {
    if (match && match?.params.query) {
      setSearch((p) => ({ ...p, query: match.params.query }));
    }
  }, [match]);

  const handleSearchVideosChannels = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    if (search.query) {
      navigate(`/search/${search.query}`);
    }
  };

  return (
    <div className={styles.navCnt}>
      <div className={styles.navLeft}>
        <RxHamburgerMenu
          className={styles.moreBtn}
          onClick={() =>
            setIsVisible((p) => ({ ...p, sidebar: !isVisible.sidebar }))
          }
        />
        <Link to="/" className={styles.logoCnt}>
          <img src={logo} height={20} alt="logo" />
          <span className={styles.logoText}>StreamVista</span>
        </Link>
      </div>
      {isVisible.sidebar && <SidebarModal setIsVisible={setIsVisible} />}

      <form className={styles.searchCnt} onSubmit={handleSearchVideosChannels}>
        <div className={styles.searchBar}>
          {!mbScrn && search.isActive && (
            <div className={styles.leftSearchIcon}>
              <GoSearch />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={search.query}
            placeholder="Search"
            onChange={(e) =>
              setSearch((p) => ({ ...p, query: e.target.value }))
            }
            onFocus={() => setSearch((p) => ({ ...p, isActive: true }))}
            onBlur={() => setSearch((p) => ({ ...p, isActive: false }))}
          />
          {!mbScrn && search.query && (
            <RxCross1
              onClick={() => {
                setSearch((p) => ({ ...p, query: "", isActive: true }));
                inputRef.current.focus();
              }}
            />
          )}
        </div>
        <div className={styles.searchIcon} onClick={handleSearchVideosChannels}>
          <GoSearch />
        </div>
      </form>

      <div className={styles.userCnt}>
        {!user ? (
          <Link to="/accounts/signin" className={styles.signInCnt}>
            <FaRegUserCircle />
            {!mbScrn && "Sign in"}
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
              user.isChannel && (
                <RiVideoAddLine
                  onClick={() =>
                    setIsVisible((p) => ({ ...p, upload: !isVisible.upload }))
                  }
                />
              )
            )}

            <IoMdNotificationsOutline />

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
                alt="profile picture"
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
