import React, { useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { editTransaction } from '../../redux/transactions/operations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditTransactionForm.css';
import DatePicker from 'react-datepicker';
import { fetchCategories } from '../../redux/categories/operations';

const schema = Yup.object().shape({
  sum: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.date()
    .typeError('Invalid date format')
    .required('Date is required'),

  comment: Yup.string().required('Comment is required'),
  type: Yup.string()
    .oneOf(['income', 'expense'])
    .required('Transaction type is required'),
  category: Yup.string().when('type', {
    is: 'expense',
    then: schema => schema.required('Category is required'),

    otherwise: schema => schema.notRequired(),
  }),
});

const EditTransactionForm = ({ onClose, transaction }) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.list);

  const { _id, type: initType, value, date, comment, category } = transaction;

  const [type, setType] = useState(initType);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  // const resolvedCategoryName =
  //   typeof category === 'object' && category?.name
  //     ? category.name
  //     : typeof category === 'string'
  //     ? categories.find(c => c._id === category)?.name
  //     : '';

  const resolvedCategoryName = (() => {
    if (typeof category === 'object' && category?.name) {
      return category.name;
    }

    if (typeof category === 'string' && Array.isArray(categories)) {
      const found = categories.find(c => c._id === category);
      return found?.name || '';
    }

    return '';
  })();

  const [selectedCategoryName, setSelectedCategoryName] =
    useState(resolvedCategoryName);

  const {
    register,
    handleSubmit,
    setValue,
    // getValues,
    formState: { errors },
    trigger,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: initType,
      sum: value,
      date: date ? date.slice(0, 10) : '',
      comment: comment,
      category: typeof category === 'object' ? category._id : category || '',
    },
  });

useEffect(() => {
  const handleClickOutside = e => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

useEffect(() => {
  if (type === 'expense' && resolvedCategoryName && categories.length > 0) {
    const resolvedCategory = categories.find(
      c => c.name === resolvedCategoryName
    );
    if (resolvedCategory) {
      setValue('category', resolvedCategory._id, { shouldValidate: true });
    }
  }
}, [categories, resolvedCategoryName, setValue, type]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const onSubmit = async data => {
    try {
      const payload = {
        type: data.type,
        value: data.sum,
        date: data.date,
        comment: data.comment,
      };

      if (data.type === 'expense') {
        if (!data.category || typeof data.category !== 'string') {
          toast.error('Please select a valid category');
          return;
        }
        payload.category = data.category;
      }

      await dispatch(
        editTransaction({ id: _id, updatedData: payload })
      ).unwrap();
      toast.success('Transaction updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleSelectCategory = cat => {
    if (cat && cat.name && cat._id) {
      setSelectedCategoryName(cat.name);
      setValue('category', cat._id, { shouldValidate: true });
      trigger('category');
      setDropdownOpen(false);
    } else {
      console.error('Invalid category data:', cat);
    }
  };

  const handleTypeChange = newType => {
    setType(newType);
    setValue('type', newType);
    setSelectedCategoryName('');
    setValue('category', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-transaction-form">
      <h2 className="editTitle">Edit Transaction</h2>

      <div className="edit-toggle-wrapper">
        <span
          className={`toggle-label ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </span>
        <span className="toggle-divider"></span>
        <span
          className={`toggle-label ${
            type === 'expense' ? 'active-expense' : ''
          }`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </span>
        <input type="hidden" {...register('type')} />
      </div>

      {type === 'expense' && (
        <div className="custom-select-wrapper" ref={dropdownRef}>
          <div
            className={`custom-select-display ${
              selectedCategoryName ? 'selected' : ''
            } ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedCategoryName || 'Select a category'}
            <span className="arrow-down"></span>
          </div>

          {dropdownOpen && (
            <ul className="custom-select-dropdown">
              {categories.map(cat => (
                <li
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat)}
                  className={
                    cat.name === selectedCategoryName ? 'selected' : ''
                  }
                >
                  {cat.name}
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
        <Controller
          name="date"
          control={control}
          defaultValue={new Date()}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={date => field.onChange(date)}
              dateFormat="yyyy-MM-dd"
            />
          )}
        />
      </div>

      <textarea
        placeholder="Comment"
        rows="3"
        {...register('comment')}
        style={{ overflow: 'hidden' }}
      ></textarea>

      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </form>
  );
};

export default EditTransactionForm;
