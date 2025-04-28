import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../redux/transactions/operations';
import './AddTransactionForm.css';


const schema = Yup.object().shape({
  type: Yup.string().required('Transaction type is required'),
  sum: Yup.number().required('Amount is required').positive().typeError('Amount must be a number'),
  date: Yup.date().required('Date is required').typeError('Invalid date format'),
  category: Yup.string()
    .nullable()
    .when('type', {
      is: 'expense',
      then: (schema) => schema.required('Category is required').notOneOf(['', null], 'Select a category'),
      otherwise: (schema) => schema.notRequired(),
    }),
  comment: Yup.string().required('Comment is required'),
});


const CATEGORIES = [
  'Main expenses', 'Products', 'Car', 'Self care',
  'Child care', 'Household products', 'Education',
  'Leisure', 'Other expenses', 'Entertainment'
];

const AddTransactionForm = ({ onClose, onTypeChange }) => {
  const [type, setType] = useState('income'); // 🎯 тип транзакции
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const dropdownRef = useRef();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { type: 'income' }
  });

  const onSubmit = async (data) => {
    console.log('Form data before mapping:', data);

    const payload = {
      type: data.type,
      value: data.sum,
      date: data.date,
      comment: data.comment,
      ...(data.type === 'expense' && { category: data.category }),
    };

    console.log('Mapped payload to send:', payload);

    try {
      await dispatch(addTransaction(payload)).unwrap();
      onClose(); 
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleType = () => {
    const newType = type === 'income' ? 'expense' : 'income';
    setType(newType);
    setValue('type', newType); 
    setSelectedCategory('');
    resetField('category'); 
    onTypeChange && onTypeChange(newType);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setValue('category', cat, { shouldValidate: true }); 
    setDropdownOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-transaction-form">
      <h2>Add Transaction</h2>

      {/*  Переключатель типа транзакции */}
      <div className="transaction-toggle-wrapper">
        <span 
          className={`toggle-label ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => {
            setType('income');
            setValue('type', 'income');
            resetField('category');
            setSelectedCategory('');
            onTypeChange && onTypeChange('income');
          }}
        >
          Income
        </span>

        <div className="toggle-switch-core" onClick={toggleType}>
          <div className={`circle-toggle ${type === 'expense' ? 'move-right red' : 'yellow'}`} />
        </div>

        <span 
          className={`toggle-label ${type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => {
            setType('expense');
            setValue('type', 'expense');
            resetField('category');
            setSelectedCategory('');
            onTypeChange && onTypeChange('expense');
          }}
        >
          Expense
        </span>

        <input type="hidden" {...register('type')} />
        {errors.type && <p className="error">{errors.type.message}</p>}
      </div>

      {/* Выпадающий список категории */}
      {type === 'expense' && (
        <div className="custom-select-wrapper" ref={dropdownRef}>
          <div 
            className={`custom-select-display ${selectedCategory ? 'selected' : ''} ${dropdownOpen ? 'open' : ''}`} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedCategory || 'Select a category'}
            <span className="arrow-down"></span>
          </div>

          {dropdownOpen && (
            <ul className="custom-select-dropdown">
              {CATEGORIES.map((cat, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectCategory(cat)}
                  className={cat === selectedCategory ? 'selected' : ''}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
          {/* Показать ошибку категории */}
          {errors.category && <p className="error">{errors.category.message}</p>}
        </div>
      )}

      {/*  Ввод суммы и даты */}
      <div className="amount-date-wrapper">
        <input type="number" placeholder="0.00" step="0.01" {...register('sum')} />
        {errors.sum && <p className="error">{errors.sum.message}</p>}

        <input type="date" {...register('date')} />
        {errors.date && <p className="error">{errors.date.message}</p>}
      </div>

      {/*  Поле комментария */}
      <textarea placeholder="Comment" rows="3" {...register('comment')}></textarea>
      {errors.comment && <p className="error">{errors.comment.message}</p>}

      {/*  Кнопки */}
      <div className="form-buttons">
        <button type="submit">Add</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
