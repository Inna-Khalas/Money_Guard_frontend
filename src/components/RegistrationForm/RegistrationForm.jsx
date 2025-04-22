import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/auth/operations.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import styles from './RegistrationForm.module.css';

const registrationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const onSubmit = async data => {
    setLoading(true);
    try {
      await dispatch(register(data));
      toast.success('Registration successful');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label className={styles.label}>
        Name:
        <input type="text" {...formRegister('name')} className={styles.input} />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}
      </label>

      <label className={styles.label}>
        Email:
        <input
          type="email"
          {...formRegister('email')}
          className={styles.input}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </label>

      <label className={styles.label}>
        Password:
        <input
          type="password"
          {...formRegister('password')}
          className={styles.input}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </label>

      <label className={styles.label}>
        Confirm Password:
        <input
          type="password"
          {...formRegister('confirmPassword')}
          className={styles.input}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}
      </label>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      <p className={styles.link}>
        Already have an account? <Link to="/login">Log in here</Link>.
      </p>
    </form>
  );
};

export default RegistrationForm;
