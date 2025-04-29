import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { editTransaction } from '../../redux/transactions/operations'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './EditTransactionForm.css'; 

//  Список  категорий
const CATEGORIES = [
  'Main expenses', 'Products', 'Car', 'Self care',
  'Child care', 'Household products', 'Education',
  'Leisure', 'Other expenses', 'Entertainment'
];


const schema = Yup.object().shape({
  sum: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),

  date: Yup.date()
    .typeError('Invalid date format')
    .required('Date is required'),

  comment: Yup.string()
    .required('Comment is required'),

  type: Yup.string()
    .oneOf(['income', 'expense'])
    .required('Transaction type is required'),

  category: Yup.string().when('type', {
    is: (val) => val === 'expense',
    then: (schema) => schema.required('Category is required for expenses'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const EditTransactionForm = ({ onClose, transaction }) => {
  const dispatch = useDispatch();

  
  const { _id, type: initType, value, date, comment, category } = transaction;

  
  const [type, setType] = useState(initType);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    typeof category === 'object' ? category.name : category
  );
  const dropdownRef = useRef();

  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: initType,
      sum: value,
      date: date.slice(0, 10), // Обрезаем до YYYY-MM-DD
      comment: comment,
      category: typeof category === 'object' ? category.name : category || '',
    },
  });

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 
  const onSubmit = async (data) => {
    try {
      console.log('Submitting edit form:', data);

      const payload = {
        type: data.type,
        value: data.sum,
        date: data.date,
        comment: data.comment,
      };

      
      if (data.type === 'expense') {
        if (!data.category) {
          toast.error('Please select a category for expenses');
          return;
        }
        payload.category = data.category;
      }

      await dispatch(editTransaction({ id: _id, updatedData: payload })).unwrap();
      toast.success('Transaction updated successfully!');
      onClose(); 

    } catch (error) {
      console.error('Edit transaction failed:', error);
      toast.error(error.message || 'Something went wrong');
    }
  };

 
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setValue('category', cat);
    setDropdownOpen(false);
  };

  
  const handleTypeChange = (newType) => {
    setType(newType);
    setValue('type', newType);
    setSelectedCategory('');
    setValue('category', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-transaction-form">
      <h2>Edit Transaction</h2>

      {/*  Переключение типа */}
      <div className="edit-toggle-wrapper">
        <span
          className={`toggle-label ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </span>

        <span className="toggle-divider"></span>

        <span
          className={`toggle-label ${type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </span>

        <input type="hidden" {...register('type')} />
      </div>

      {/*  Селект категорий для расходов */}
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
              {CATEGORIES.map((cat, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectCategory(cat)}
                  className={cat === selectedCategory ? 'selected' : ''}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/*  Поля ввода */}
      <div className="amount-date-wrapper">
        <input
          type="number"
          placeholder="0.00"
          step="0.01"
          {...register('sum')}
        />
        {errors.sum && <p className="error">{errors.sum.message}</p>}

        <input
          type="date"
          {...register('date')}
        />
        {errors.date && <p className="error">{errors.date.message}</p>}
      </div>

      {/*  Комментарий */}
      <textarea
        placeholder="Comment"
        rows="3"
        {...register('comment')}
      ></textarea>
      {errors.comment && <p className="error">{errors.comment.message}</p>}

      {/*  Кнопки */}
      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
