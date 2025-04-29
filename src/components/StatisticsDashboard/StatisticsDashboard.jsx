import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SummaryStatistics } from '../../redux/statistics/operations';
import Select, { components } from 'react-select';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';
import { useMediaQuery } from 'react-responsive';
import styles from './StatisticsDashboard.module.css';

const StatisticsDashboard = () => {
  const notMobile = useMediaQuery({ query: '(min-width: 768px)' });

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const startingYear = 2020;
  const years = [];
  for (let year = new Date().getFullYear(); year >= startingYear; year--) {
    years.push({ value: year, label: `${year}` });
  }

  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleMonthChange = selectData => {
    setSelectedMonth(selectData.value);
    dispatch(SummaryStatistics({ month: selectData.value, year: selectedYear }));
  };

  const handleYearChange = selectData => {
    setSelectedYear(selectData.value);
    dispatch(SummaryStatistics({ month: selectedMonth, year: selectData.value }));
  };

  useEffect(() => {
    dispatch(SummaryStatistics({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const availableMonths = selectedYear < currentYear
    ? months
    : selectedYear === currentYear
    ? months.filter(month => month.value <= currentMonth)
    : [];

  const DropdownIndicator = ({ selectProps, ...rest }) => (
    <components.DropdownIndicator {...rest}>
      {selectProps.menuIsOpen ? (
        <SlArrowUp size={18} label="Arrow up" color="var(--white)" />
      ) : (
        <SlArrowDown size={18} label="Arrow down" color="var(--white)" />
      )}
    </components.DropdownIndicator>
  );

  const customStyles = {
    container: (base) => ({
      ...base,
      fontFamily: "'Poppins-Regular', sans-serif",
      width: notMobile ? '50%' : '100%',
    }),
    control: (base) => ({
      ...base,
      backgroundColor: 'rgba(74, 86, 226, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      borderRadius: '8px',
      height: '50px',
      boxShadow: 'none',
      cursor: 'pointer',
      paddingRight: '13px',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fbfbfb',
      fontSize: '16px',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '16px',
    }),
    menu: (base) => ({
      ...base,
      background: 'linear-gradient(0deg, #533DBA 0%, #50309A 43%, #6A46A5 73%, #855DAF 100%)',
      borderRadius: '8px',
      boxShadow: '0px 4px 60px 0px rgba(0, 0, 0, 0.25)',
      fontFamily: "'Poppins-Regular', sans-serif",
      fontSize: '16px',
      fontWeight: '400',
      overflow: 'hidden',
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      color: isFocused ? '#FF868D' : '#FBFBFB',
      cursor: 'pointer',
    }),
    menuList: (base) => ({
      ...base,
      scrollbarWidth: 'thin',
      scrollbarColor: '#bfb4dd transparent',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#bfb4dd',
        borderRadius: '12px',
      },
    }),
  };

  return (
    <div className={styles.dashboard}>
      <Select
        className={styles.select}
        classNamePrefix="custom-select"
        styles={customStyles}
        required
        options={availableMonths}
        components={{ DropdownIndicator, IndicatorSeparator: () => null }}
        placeholder="Select month"
        isSearchable={false}
        onChange={handleMonthChange}
        defaultValue={months[selectedMonth - 1]}
      />
      <Select
        className={styles.select}
        classNamePrefix="custom-select"
        styles={customStyles}
        required
        options={years}
        components={{ DropdownIndicator, IndicatorSeparator: () => null }}
        placeholder="Select year"
        isSearchable={false}
        onChange={handleYearChange}
        defaultValue={years.find(year => year.value === selectedYear)}
      />
    </div>
  );
};

export default StatisticsDashboard;
