import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.jsx';
import styles from './RegistrationPage.module.css';

const RegistrationPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.background}></div>

      <div className={styles.container}>
        <div className={styles.logoBlock}>
          <svg className={styles.logoIcon} viewBox="0 0 27 26">
            <use href="/sprite.svg#mg-logo" />
          </svg>
          <span className={styles.logoWrapper}>
            <span className={styles.word}>Money Guard</span>
          </span>
        </div>

        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
