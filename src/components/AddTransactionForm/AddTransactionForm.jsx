import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './AddTransactionForm.css'; 


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


const CATEGORIES = [
  'Main expenses', 'Products', 'Car', 'Self care',
  'Child care', 'Household products', 'Education',
  'Leisure', 'Other expenses', 'Entertainment'
];

const AddTransactionForm = ({ onClose, onTypeChange }) => {
  const [type, setType] = useState('income');            
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const dropdownRef = useRef(); 


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { type: 'income' }
  });


  const onSubmit = (data) => {
    console.log('Form data:', data);
    onClose();
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
    setSelectedCategory('');
    setValue('category', '');
    onTypeChange && onTypeChange(newType); 
  };


  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setValue('category', cat);
    setDropdownOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-transaction-form">
     
      <h2>Add Transaction</h2>

     
      <div className="transaction-toggle-wrapper">
        <span 
          className={`toggle-label ${type === 'income' ? 'active-income' : ''}`} 
          onClick={() => {
            setType('income');
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
            onTypeChange && onTypeChange('expense');
          }}
        >
          Expense
        </span>

     
        <input type="hidden" value={type} {...register('type')} />
        {errors.type && <p className="error">{errors.type.message}</p>}
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

    
      <textarea 
        placeholder="Comment" 
        rows="3" 
        {...register('comment')}
      ></textarea>
      {errors.comment && <p className="error">{errors.comment.message}</p>}

    
      <div className="form-buttons">
        <button type="submit">Add</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default AddTransactionForm;