// src/components/ai/ChatMessage/ChatMessage.jsx
import React from "react";
import { formatDateTime } from "../../../utils/formatDate";
import styles from "./ChatMessage.module.css";

const ChatMessage = ({ type, content, timestamp }) => {
  const isUser = type === "user";

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.ai}`}>
      <div className={styles.avatar}>{isUser ? "👤" : "🧠"}</div>
      <div className={styles.content}>
        <div className={styles.bubble}>
          {content.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        {timestamp && (
          <div className={styles.timestamp}>{formatDateTime(timestamp)}</div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
