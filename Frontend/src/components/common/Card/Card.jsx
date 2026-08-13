// src/components/common/Card/Card.jsx
import React from "react";
import styles from "./Card.module.css";

const Card = ({ children, className = "", variant = "default", ...props }) => {
  const classes = [styles.card, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
