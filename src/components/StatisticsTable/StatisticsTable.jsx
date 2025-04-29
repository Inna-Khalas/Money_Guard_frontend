import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import summarySelector from '../../redux/statistics/selectors';
import { SummaryStatistics } from '../../redux/statistics/operations';
import styles from './StatisticsTable.module.css';

export const formatNumber = number => {
  return Number(number)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$& ');
};

const coloredCategories = {
  'Entertainment': '#ff85d2',
  'Car': 'rgb(255, 104, 109)',
  'Products': 'rgb(255, 157, 137)',
  'Main Expenses': 'rgb(254, 208, 87)',
  'Leisure': 'rgb(91, 255, 167)',
  'Other Expenses': 'rgb(0, 173, 95)',
  'Education': 'rgb(115, 222, 255)',
  'Self Care': 'rgb(170, 154, 255)',
  'Child Care': 'rgb(87, 101, 255)',
  'Household products': 'rgb(114, 61, 239)',
};

const StatisticsTable = () => {
  const summary = useSelector(summarySelector);
  const dispatch = useDispatch();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    dispatch(SummaryStatistics({ month: currentMonth, year: currentYear }));
  }, [dispatch, currentMonth, currentYear]);

  const periodSummary = summary.categoriesSummary
    ? summary.categoriesSummary
        .filter(category => category.type === 'EXPENSE')
        .map(category => ({
          ...category,
          color: coloredCategories[category.name] || '#f0f0f0',
        }))
        .sort((a, b) => a.total - b.total)
    : [];

  return (
    <section className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Category</th>
            <th className={styles.sum}>sum</th> 
          </tr>
        </thead>
        <tbody>
          {periodSummary.length ? (
            periodSummary.map((category, index) => (
              <tr key={index}>
                <td>
                  <span
                    className={styles.colorIndicator}
                    style={{
                      backgroundColor: category.color,
                    }}
                  />
                  {category.name}
                </td>
                <td className={styles.sum}>{formatNumber(category.total)}</td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className={styles.noTransactions}>
                You haven't made any transactions during this period
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.summary}>
        <div className={styles.expenses}>
          <h3>Expenses:</h3>
          <p>{formatNumber(summary.expenseSummary|| 0)}</p>
        </div>
        <div className={styles.income}>
          <h3>Income:</h3>
          <p>{formatNumber(summary.incomeSummary|| 0)}</p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsTable;
