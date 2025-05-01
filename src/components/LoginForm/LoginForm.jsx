import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdOutlineMailOutline, MdLock } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';
import logo from '../../assets/favicon.svg';

import { loginThunk } from '../../redux/auth/operations';

import s from './LoginForm.module.css';

const loginValSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
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
      await dispatch(loginThunk(data)).unwrap();
      toast.success('Login successful!', {
        style: {
          border: '3px solid #734aef',
          padding: '10px',
          color: '#fbfbfb',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      });
      navigate('/dashboard/home', { replace: true });
    } catch (error) {
      console.log(error);

      toast.error('Incorrect email or password. Please try again.', {
        style: {
          border: '3px solid rgba(255, 255, 255, 0.1)',
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
          <img src={logo} alt="Money Guard Logo" />
          <h2 className={s.textLogo}>Money Guard</h2>
        </div>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={s.inputs}>
            <div className={s.inputGroup}>
              <div className={s.inputWrapper}>
                <MdOutlineMailOutline className={s.inputIcon} />
                {/* <svg className={s.inputIcon} width="12" height="12">
                <use href={`${}#${name}`}> </use>
              </svg> */}
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  {...register('email')}
                  className={s.input}
                />
              </div>
              {errors.email && (
                <p className={s.inputError}>{errors.email.message}</p>
              )}
            </div>

            <div className={s.inputGroup}>
              <div className={s.inputWrapper}>
                <MdLock className={s.inputIcon} />
                {/* <svg className={s.inputIcon} width="12" height="12">
                <use href={`${}#${name}`}></use>
              </svg> */}
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
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                )}
              </div>
              {errors.password && (
                <p className={s.inputError}>{errors.password.message}</p>
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
