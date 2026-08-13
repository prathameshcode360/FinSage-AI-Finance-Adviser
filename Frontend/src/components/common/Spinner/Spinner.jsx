// src/components/common/Spinner/Spinner.jsx
import React from "react";
import styles from "./Spinner.module.css";

const Spinner = ({ size = "medium", className = "" }) => {
  const classes = [styles.spinner, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} />;
};

export default Spinner;
