import styles from './RegistrationPage.module.css';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.jsx';
import mgLogo from '../../assets/icons/mg-logo.svg';

const RegistrationPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.background}></div>

      <div className={styles.container}>
        <div className={styles.logoBlock}>
          <img
            src={mgLogo}
            alt="Money Guard Logo"
            className={styles.logoIcon}
          />
          <span className={styles.logoWrapper}>
            <span className={styles.logoAccent}>M</span>oneyGuard
          </span>
        </div>

        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
