import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './EditTransactionForm.css'; 


const CATEGORIES = [
  'Main expenses', 'Products', 'Car', 'Self care',
  'Child care', 'Household products', 'Education',
  'Leisure', 'Other expenses', 'Entertainment'
];


const schema = Yup.object().shape({
  type: Yup.string().required('Transaction type is required'),
  sum: Yup.number().required('Amount is required').positive().typeError('Amount must be a number'),
  date: Yup.date().required('Date is required').typeError('Invalid date format'),
  category: Yup.string().when('type', {
    is: 'expense',
    then: Yup.string().required('Category is required for expenses'),
    otherwise: Yup.string(),
  }),
  comment: Yup.string().required('Comment is required'),
});

const EditTransactionForm = ({ onClose, transaction, onTypeChange }) => {
  const { type: initType, sum, date, comment, category } = transaction;

  const [type, setType] = useState(initType);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      sum,
      date,
      comment,
      category: category || ''
    }
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


  const onSubmit = (data) => {
    console.log('Edited transaction:', data);
    onClose();
  };


  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setValue('category', cat);
    setDropdownOpen(false);
  };


  const handleTypeChange = (newType) => {
    setType(newType);
    setSelectedCategory('');
    setValue('type', newType);
    setValue('category', '');
    onTypeChange && onTypeChange(newType);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-transaction-form">

      <h2>Edit Transaction</h2>


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
        </div>
      )}


      <div className={`amount-date-wrapper ${type === 'expense' ? 'active-expense' : ''}`}>
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


      <textarea 
        placeholder="Comment" 
        rows="3" 
        {...register('comment')}
      ></textarea>
      {errors.comment && <p className="error">{errors.comment.message}</p>}


      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default EditTransactionForm;