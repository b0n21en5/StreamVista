import axios from "axios";
import {
  allCommentsRoute,
  profilePicRoute,
  updateCommentsRoute,
} from "../../utills/apiRoutes";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BsEmojiGrin, BsFilterLeft } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import Picker from "emoji-picker-react";
import toast from "react-hot-toast";
import styles from "./Comments.module.css";

const Comments = () => {
  const [comments, setComments] = useState({
    data: [],
    newMessage: "",
    isEmoji: false,
    showButtons: false,
  });
  const [mbScrn, setMbScrn] = useState(true);

  const inputRef = useRef(null);

  const { videoId } = useParams();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (window.innerWidth > 440) {
      setMbScrn(false);
    }
  }, [window.innerWidth]);

  const fetchAllComments = async () => {
    try {
      const { data } = await axios.get(`${allCommentsRoute}/${videoId}`);
      setComments((p) => ({ ...p, data: data.comments }));
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  const handleAddComments = async () => {
    try {
      const { data } = await axios.put(`${updateCommentsRoute}/${videoId}`, {
        userId: user?._id,
        message: comments.newMessage,
      });
      if (data) {
        toast.success("Added New Comment");
      }
      setComments((p) => ({
        ...p,
        newMessage: "",
        isEmoji: false,
        showButtons: false,
      }));
      fetchAllComments();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleDeleteComments = async (messageId) => {
    try {
      const { data } = await axios.put(`${updateCommentsRoute}/${videoId}`, {
        messageId: messageId,
      });
      fetchAllComments();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("focus", () =>
        setComments((p) => ({ ...p, showButtons: true }))
      );
    }
  }, [inputRef]);

  return (
    <div className={styles.mainCnt}>
      <div className={styles.heading}>
        <span>{comments?.data?.length}</span>
        <span>Comments</span>
        <BsFilterLeft />
      </div>

      {user && (
        <div className={styles.messCnt}>
          <div className={styles.logoCnt}>
            <img
              src={`${profilePicRoute}/${user?._id}`}
              width={40}
              height={40}
              alt="user logo"
            />
          </div>
          <div className={styles.detCnt}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              onChange={(e) =>
                setComments((p) => ({ ...p, newMessage: e.target.value }))
              }
              value={comments.newMessage}
            />

            {/* Comment buttons section */}
            {comments.showButtons && (
              <div className={styles.commBtnCnt}>
                {!mbScrn && (
                  <BsEmojiGrin
                    onClick={() =>
                      setComments((p) => ({ ...p, isEmoji: !comments.isEmoji }))
                    }
                  />
                )}

                <div className={styles.btnCnt}>
                  <div
                    className={styles.btn}
                    onClick={() =>
                      setComments((p) => ({
                        ...p,
                        isEmoji: false,
                        newMessage: "",
                        showButtons: false,
                      }))
                    }
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.btn} ${styles.commBtn}`}
                    onClick={handleAddComments}
                  >
                    Comment
                  </div>
                </div>
              </div>
            )}

            {/* Emoji picker */}
            {comments.isEmoji && (
              <Picker
                onEmojiClick={(e) =>
                  setComments((p) => ({
                    ...p,
                    newMessage: comments.newMessage + e.emoji,
                  }))
                }
                height={250}
                width={600}
                theme="dark"
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
                searchDisabled
              />
            )}
          </div>
        </div>
      )}

      {/* Message container */}
      {comments.data?.length ? (
        <div className={styles.allCommCnt}>
          {comments.data?.map((cmnt) => (
            <div key={cmnt._id} className={styles.messCnt}>
              <div className={styles.logoCnt}>
                <img
                  src={`${profilePicRoute}/${cmnt?.userId?._id}`}
                  width={40}
                  height={40}
                  alt="user logo"
                />
              </div>
              <div className={styles.detCnt}>
                <span className={styles.name}>@{cmnt.userId?.name}</span>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={cmnt.message}
                  disabled
                />
                {cmnt.userId?._id === user?._id && (
                  <div className={styles.ctaCnt}>
                    <MdOutlineModeEdit />
                    <RiDeleteBin6Line
                      onClick={() => handleDeleteComments(cmnt._id)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comments;
