import React from "react";
import styles from "./Postbar.module.scss";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../pages/utils";

export const Postbar = ({ postname, postid, postdescription }) => {
  const navigate = useNavigate();
  const navigateToPosts = () => {
    navigate(`/posts/${postid}`);
  };
  return (
    <div className={styles.Postbarborder}>
      <div className={styles.PostbarDetails}>
        <div className={styles.postAndDesc}>
          <h3>{postname}</h3>
          <span
            style={{ fontSize: "17px", fontWeight: "200", textAlign: "left" }}
          >
            {postdescription.length > 119
              ? postdescription.slice(0, 120) + "..."
              : postdescription}
          </span>
        </div>
        <div style={{ width: "30%" }}>
          <button
            style={{ width: "100%" }}
            className={styles.button}
            onClick={navigateToPosts}
          >
            <svg
              width="20px"
              height="20px"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            &nbsp; View Post
          </button>
          <br />
          <button
            style={{ width: "100%" }}
            className={styles.button}
            onClick={() => {
              copyToClipboard(`${window.location.origin}/posts/${postid}`);
              console.log(`${window.location.origin}/posts/${postid}`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="20px"
              height="20px"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
            &nbsp; &nbsp; Share
          </button>
        </div>
      </div>
    </div>
  );
};
