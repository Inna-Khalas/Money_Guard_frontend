import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import { register, loginThunk } from '../../redux/auth/operations';
import styles from './RegistrationForm.module.css';
import userIcon from '../../pages/RegistrationPage/pic/icons/user.svg';
import emailIcon from '../../pages/RegistrationPage/pic/icons/email.svg';
import lockIcon from '../../pages/RegistrationPage/pic/icons/lock.svg';
import eyeIcon from '../../pages/RegistrationPage/pic/icons/eye-open.svg';
import eyeOffIcon from '../../pages/RegistrationPage/pic/icons/eye-closed.svg';

const registrationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name cannot be longer than 50 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const STORAGE_KEY = 'registration-form-data';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: savedData,
  });

  const password = watch('password') || '';
  const confirmPassword = watch('confirmPassword') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(prev => !prev);

  useEffect(() => {
    const subscription = watch(values => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async data => {
    const { name, email, password } = data;

    try {
      await register({ name, email, password });
      toast.success('Registration successful');
      await dispatch(loginThunk({ email, password })).unwrap();
      localStorage.removeItem(STORAGE_KEY);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      navigate('/login');
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      {['name', 'email', 'password', 'confirmPassword'].map(field => (
        <label className={styles.inputWrapper} key={field}>
          <div
            className={`${styles.iconWrapper} ${
              field === 'confirmPassword' ? styles.offsetFix : ''
            }`}
          >
            {field === 'name' && <img src={userIcon} alt="User Icon" />}
            {field === 'email' && <img src={emailIcon} alt="Email Icon" />}
            {field === 'password' && <img src={lockIcon} alt="Password Icon" />}
            {field === 'confirmPassword' && (
              <img src={lockIcon} alt="Confirm Password Icon" />
            )}
          </div>

          <input
            type={
              field === 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : field === 'confirmPassword'
                ? showConfirmPassword
                  ? 'text'
                  : 'password'
                : 'text'
            }
            {...formRegister(field)}
            className={styles.input}
            autoComplete={
              field === 'password' || field === 'confirmPassword'
                ? 'new-password'
                : 'off'
            }
          />

          <span
            className={`${styles.placeholder} ${
              watch(field) ? styles.active : ''
            } ${field === 'confirmPassword' ? styles.offsetFix : ''}`}
          >
            {field === 'confirmPassword'
              ? 'Confirm password'
              : field === 'email'
              ? 'E-mail'
              : field.charAt(0).toUpperCase() + field.slice(1)}
          </span>

          <span className={styles.underline}></span>

          {errors[field] && (
            <span className={styles.error}>{errors[field].message}</span>
          )}

          {field === 'confirmPassword' && (
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${
                    password && confirmPassword
                      ? Math.floor(
                          (Array.from(confirmPassword).filter(
                            (char, idx) => char === password[idx]
                          ).length /
                            password.length) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          )}

          {(field === 'password' || field === 'confirmPassword') && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={
                field === 'password'
                  ? togglePasswordVisibility
                  : toggleConfirmPasswordVisibility
              }
              tabIndex={-1}
            >
              <img
                src={
                  (field === 'password' ? showPassword : showConfirmPassword)
                    ? eyeOffIcon
                    : eyeIcon
                }
                alt="Toggle visibility"
              />
            </button>
          )}
        </label>
      ))}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>
          Register
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
