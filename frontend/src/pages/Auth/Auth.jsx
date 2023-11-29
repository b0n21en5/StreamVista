import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  loginRoute,
  registerRoute,
  resetPasswordRoute,
} from "../../utills/apiRoutes";
import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const Auth = () => {
  const [postData, setPostData] = useState({
    name: "",
    email: "",
    password: "",
    answer: "",
    pic: "",
  });

  const path = useLocation().pathname.split("/")[2];

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRegisterUser = async () => {
    try {
      const formData = new FormData();
      formData.append("name", postData.name);
      formData.append("email", postData.email);
      formData.append("password", postData.password);
      formData.append("answer", postData.answer);
      if (postData.pic) {
        formData.append("pic", postData.pic);
      }

      const { data } = await axios.post(registerRoute, formData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserLogin = async () => {
    try {
      const { data } = await axios.post(loginRoute, postData);
      dispatch(setUser(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { data } = await axios.put(resetPasswordRoute, {
        ...postData,
        newPassword: postData.password,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputFields = (fieldName, e) => {
    if (fieldName === "pic") {
      setPostData((p) => ({ ...p, [fieldName]: e.target.files[0] }));
    } else {
      setPostData((p) => ({ ...p, [fieldName]: e.target.value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (path === "signup") {
      handleRegisterUser();
    } else if (path === "signin") {
      handleUserLogin();
    } else {
      handleResetPassword();
    }
  };

  useEffect(() => {
    setPostData({
      username: "",
      email: "",
      password: "",
      answer: "",
      pic: "",
    });
  }, [path]);

  return (
    <div className={styles.authMain}>
      <form className={styles.authCnt} onSubmit={(e) => handleFormSubmit(e)}>
        <div className={styles.heading}>
          <h1>
            {path[0].toUpperCase() + path.substr(1, 3) + " " + path.substr(4)}
          </h1>
          {path === "signin" && (
            <div className={styles.signTxt}>to continue to StreamVista</div>
          )}
        </div>
        <div className={styles.inputCnt}>
          {path === "signup" && (
            <input
              type="text"
              placeholder="Enter name"
              onChange={(e) => handleInputFields("name", e)}
              value={postData.name}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => handleInputFields("email", e)}
            value={postData.email}
            required
          />
          <div className={styles.passCnt}>
            <input
              type="password"
              placeholder={
                path === "reset-password" ? "New Password" : "Password"
              }
              onChange={(e) => handleInputFields("password", e)}
              value={postData.password}
              required
            />
            {path === "signin" && (
              <Link to="/accounts/reset-password">Forgot password?</Link>
            )}
          </div>
          {path !== "signin" && (
            <input
              type="text"
              placeholder="Favorite Sport"
              onChange={(e) => handleInputFields("answer", e)}
              value={postData.answer}
              required
            />
          )}
          {path === "signup" && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputFields("pic", e)}
            />
          )}
        </div>

        <div className={styles.btnCnt}>
          {path === "signin" ? (
            <Link to="/accounts/signup">Create Account</Link>
          ) : (
            <Link to="/accounts/signin">Sign in</Link>
          )}
          <button>Next</button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
