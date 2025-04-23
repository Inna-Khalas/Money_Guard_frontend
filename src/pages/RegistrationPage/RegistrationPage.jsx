import styles from './RegistrationPage.module.css';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.jsx';

const RegistrationPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.background}></div>

      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <span className={styles.logoAccent}>M</span>oneyGuard
        </div>

        <h1 className={styles.title}>Sign Up</h1>

        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
