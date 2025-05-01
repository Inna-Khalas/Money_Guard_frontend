import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Header.module.css';
import favicon from '../../assets/favicon.svg';
import group from './Group 7.svg';
import LogOut from '../LogOut/LogOut';

import { selectUser } from '../../redux/auth/selectors';
import { fetchCurrentUser } from '../../redux/auth/operations';

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  const handleLogout = () => {
    setShowLogout(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img src={favicon} alt="Logo" className={styles.logo} />
        <span className={styles.appName}>Money Guard</span>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.profileButton}>
          {user.email?.split('@')[0] || 'user'}
        </button>
        <button className={styles.profileButton}>
          <img src={group} alt="group" className={styles.editIcon} />
        </button>
        <button
          className={clsx(styles.profileButton, styles.hidden)}
          onClick={() => setShowLogout(true)}
        >
          Exit
        </button>
      </div>

      {showLogout && (
        <LogOut onClose={() => setShowLogout(false)} onLogout={handleLogout} />
      )}
    </header>
  );
};

export default Header;
