import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { loginThunk } from '../../redux/auth/operations';
import { Link, useNavigate } from 'react-router-dom';
import s from './LoginForm.module.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdOutlineMailOutline, MdLock } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';

const loginValSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(12, 'Password must be at most 12 characters')
    .required('Password is required'),
});

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginValSchema),
    mode: 'onChange',
  });

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = showPassword ? 'text' : 'password';

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async data => {
    try {
      const userData = await dispatch(loginThunk(data)).unwrap();
      localStorage.setItem('token', userData.token);
      toast.success('Login successful!', {
        style: {
          border: '3px solid #734aef',
          padding: '10px',
          color: '#fbfbfb',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      });
      reset();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Incorrect email or password. Please try again.', {
        style: {
          border: '3px solid #F00000',
          padding: '10px',
          color: '#fbfbfb',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      });
    }
  };

  return (
    <div className={s.backdrop}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={s.modal}>
        <div className={s.logo}>
          <img src="/src/assets/favicon.svg" alt="Money Guard Logo" />
          <h2 className={s.textLogo}>Money Guard</h2>
        </div>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={s.inputs}>
            <div className={s.inputGroup}>
              <svg className={s.inputIcon} width="12" height="12">
                {' '}
                <MdOutlineMailOutline />
                {/* <use href={`${}#${name}`}> </use> */}
              </svg>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                {...register('email')}
                className={s.input}
              />
              {errors.email && (
                <span className={s.inputError}>{errors.email.message}</span>
              )}
            </div>

            <div className={s.inputGroup}>
              <svg className={s.inputIcon} width="12" height="12">
                {' '}
                <MdLock />
                {/* <use href={`${}#${name}`}></use> */}
              </svg>
              <input
                type={isPassword}
                name="password"
                placeholder="Password"
                {...register('password')}
                className={s.input}
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className={s.toggleBtn}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              )}
              {errors.password && (
                <span className={s.inputError}>{errors.password.message}</span>
              )}
            </div>
          </div>

          <div className={s.btns}>
            <button
              type="submit"
              className={`${s.logButton} ${s.multiColorButton}`}
            >
              LogIn{' '}
            </button>

            <Link to="/register">
              <button
                type="button"
                className={`${s.logButton} ${s.whiteButton}`}
              >
                Register{' '}
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
