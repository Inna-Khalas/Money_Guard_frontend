import React, { useState, useEffect } from 'react';
import { Chart } from '../../components/Chart/Chart';
import StatisticsTable from '../../components/StatisticsTable/StatisticsTable';
import StatisticsDashboard from '../../components/StatisticsDashboard/StatisticsDashboard';
import { Loader } from '../../components/Loader/Loader';
import styles from './Statistics.module.css';

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false); 
      }, 2000); 
    };

    fetchData();
  }, []); 

  if (loading) {
    return <Loader />; 
  }

  return (
    <div className={styles.container}>
      <h2>Statistics</h2>
      <div className={styles.content}>
        <Chart />
        <div className={styles.table}>
          <StatisticsDashboard />
          <StatisticsTable />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
