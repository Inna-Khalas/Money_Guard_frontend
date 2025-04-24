import React from "react";
import styles from "./header.module.css";
import favicon from "../../assets/favicon.svg";
import group from "./Group 7.svg";
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src={favicon} alt="Logo" className={styles.logo} />
        <span className={styles.appName}>Money Guard</span>
      </div>
      <button className={styles.profileButton}>
        Name
        <img src={group} alt="group" className={styles.editIcon} />
        Exit
      </button>
    </header>
  );
};

export default Header;
