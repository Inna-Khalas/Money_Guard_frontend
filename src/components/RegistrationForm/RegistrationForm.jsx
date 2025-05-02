import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';

import { register } from '../../redux/auth/operations';
import styles from './RegistrationForm.module.css';

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
  const navigate = useNavigate();
  const watchRef = useRef(null);

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
  const [focusedField, setFocusedField] = useState(null);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(prev => !prev);

  useEffect(() => {
    const subscription = watch(values => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    watchRef.current = subscription;
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async data => {
    const { name, email, password } = data;

    try {
      await register({ name, email, password });
      toast.success('Registration successful');

      watchRef.current?.unsubscribe();
      localStorage.removeItem(STORAGE_KEY);

      navigate('/login', { state: { email } });
    } catch (error) {
      const message = error?.error || error?.message || 'Registration failed';
      toast.error(message);
      if (error?.status === 409) return;

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
            {field === 'name' && (
              <svg viewBox="0 0 24 24" role="img" aria-label="User Icon">
                <use href="/sprite.svg#user" />
              </svg>
            )}
            {field === 'email' && (
              <svg viewBox="0 0 24 24" role="img" aria-label="Email Icon">
                <use href="/sprite.svg#email" />
              </svg>
            )}
            {field === 'password' && (
              <svg viewBox="0 0 24 24" role="img" aria-label="Password Icon">
                <use href="/sprite.svg#lock" />
              </svg>
            )}
            {field === 'confirmPassword' && (
              <svg
                viewBox="0 0 24 24"
                role="img"
                aria-label="Confirm Password Icon"
              >
                <use href="/sprite.svg#lock" />
              </svg>
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
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
          />

          <span
            className={`${styles.placeholder} ${
              watch(field) ? styles.active : ''
            }`}
          >
            {field === 'confirmPassword'
              ? 'Confirm password'
              : field === 'email'
              ? 'E-mail'
              : field.charAt(0).toUpperCase() + field.slice(1)}
          </span>

          <span
            className={`${styles.underline} ${
              focusedField === field ? styles.underlineActive : ''
            }`}
          />

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
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <use
                  href={
                    field === 'password'
                      ? showPassword
                        ? '/sprite.svg#eye-closed'
                        : '/sprite.svg#eye-open'
                      : showConfirmPassword
                      ? '/sprite.svg#eye-closed'
                      : '/sprite.svg#eye-open'
                  }
                />
              </svg>
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
