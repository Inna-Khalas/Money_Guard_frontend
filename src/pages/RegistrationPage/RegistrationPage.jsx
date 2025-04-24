import styles from './RegistrationPage.module.css';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.jsx';
import mgLogo from '../../pages/RegistrationPage/pic/icons/mg-logo.svg';

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
            {'Money Guard'.split('').map((char, idx) => (
              <span key={idx} className={styles.char}>
                {char}
              </span>
            ))}
          </span>{' '}
        </div>

        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
