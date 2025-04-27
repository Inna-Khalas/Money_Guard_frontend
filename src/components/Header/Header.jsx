import React from 'react';
import styles from './Header.module.css';
import favicon from '../../assets/favicon.svg';
import group from './Group 7.svg';
import clsx from 'clsx';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src={favicon} alt="Logo" className={styles.logo} />
        <span className={styles.appName}>Money Guard</span>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.profileButton}>Name</button>
        <button className={styles.profileButton}>
          <img src={group} alt="group" className={styles.editIcon} />
        </button>
        <button className={clsx(styles.profileButton, styles.hidden)}>
          Exit
        </button>
      </div>
    </header>
  );
};

export default Header;
