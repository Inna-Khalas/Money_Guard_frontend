import React, { useState, useRef, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../redux/transactions/operations';
import { selectAllCategories } from '../../redux/categories/selectors';
import { fetchCategories } from '../../redux/categories/operations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddTransactionForm.css';


const schema = Yup.object().shape({
  type: Yup.string().required('Transaction type is required'),
  sum: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date()
    .typeError('Invalid date format')
    .required('Date is required'),
  category: Yup.string().nullable().when('type', {
    is: 'expense',
    then: schema =>
      schema.required('Category is required').notOneOf(['', null], 'Select a category'),
    otherwise: schema => schema.notRequired(),
  }),
  comment: Yup.string().required('Comment is required'),
});

const AddTransactionForm = ({ onClose, onTypeChange }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);

  const [type, setType] = useState('income');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const dropdownRef = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    resetField,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { type: 'income' },
  });

  const onSubmit = async (data) => {
    const payload = {
      type: data.type,
      value: data.sum,
      date: data.date,
      comment: data.comment,
      ...(data.type === 'expense' && { category: data.category }),
    };

    try {
      await dispatch(addTransaction(payload)).unwrap();
      toast.success('Transaction added successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add transaction');
    }
  };


  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    dispatch(fetchCategories());

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);


  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => {
        toast.error(error.message);
      });
    }
  }, [errors]);


  const toggleType = () => {
    const newType = type === 'income' ? 'expense' : 'income';
    setType(newType);
    setValue('type', newType);
    setSelectedCategory('');
    resetField('category');
    onTypeChange && onTypeChange(newType);
  };


  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setValue('category', catId, { shouldValidate: true });
    trigger('category');
    setDropdownOpen(false);
  };

  const currentCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="add-transaction-form">
      <h2 className="addTitle">Add Transaction</h2>

      {/* Тип транзакции */}
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
      </div>

      {/* Категория */}
      {type === 'expense' && (
        <div className="custom-select-wrapper" ref={dropdownRef}>
          <div
            className={`custom-select-display ${selectedCategory ? 'selected' : ''} ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedCategory
              ? currentCategories.find(cat => cat._id === selectedCategory)?.name || 'Select a category'
              : 'Select a category'}
            <span className="arrow-down"></span>
          </div>

          {dropdownOpen && (
            <ul className="custom-select-dropdown">
              {currentCategories.map((cat) => (
                <li
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat._id)}
                  className={cat._id === selectedCategory ? 'selected' : ''}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Сумма и дата */}
      <div className="amount-date-wrapper">
        <input type="number" placeholder="0.00" step="0.01" {...register('sum')} />
        <input type="date" {...register('date')} />
      </div>

      {/* Комментарий */}
      <textarea placeholder="Comment" rows="3" {...register('comment')}></textarea>

      {/* Кнопки */}
      <div className="form-buttons">
        <button type="submit">Add</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </form>
  );
};

export default AddTransactionForm;
