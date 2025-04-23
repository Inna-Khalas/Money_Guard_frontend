import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './RegistrationForm.module.css';
import { useDispatch } from 'react-redux';
import { register as registerThunk } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import userIcon from '../../assets/icons/user.svg';
import emailIcon from '../../assets/icons/email.svg';
import lockIcon from '../../assets/icons/lock.svg';

// Схема валідації
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
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
  });

  const password = watch('password') || '';
  const confirmPassword = watch('confirmPassword') || '';

  const onSubmit = async data => {
    try {
      await dispatch(registerThunk(data));
      toast.success('Registered successfully');
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed');
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
          <span
            className={`${styles.placeholder} ${
              watch(field) ? styles.active : ''
            }`}
          >
            {field === 'confirmPassword'
              ? 'Confirm password'
              : field.charAt(0).toUpperCase() + field.slice(1)}
          </span>
          <div className={styles.iconWrapper}>
            {field === 'name' && <img src={userIcon} alt="User Icon" />}
            {field === 'email' && <img src={emailIcon} alt="Email Icon" />}
            {field === 'password' && <img src={lockIcon} alt="Password Icon" />}
          </div>
          <input
            type={field.includes('password') ? 'password' : 'text'}
            {...formRegister(field)}
            className={`${styles.input} ${
              field === 'confirmPassword' ? styles.inputLarge : ''
            }`}
          />
          <span className={styles.underline}></span>
          {errors[field] && (
            <span className={styles.error}>{errors[field].message}</span>
          )}
          {field === 'confirmPassword' && (
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width:
                    password && confirmPassword === password ? '100%' : '0%',
                }}
              />
            </div>
          )}
        </label>
      ))}

      <button type="submit" className={styles.button}>
        Register
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => navigate('/login')}
      >
        Log in
      </button>
    </form>
  );
};

export default RegistrationForm;
