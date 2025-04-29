import { Chart } from '../../components/Chart/Chart';
import StatisticsTable from '../../components/StatisticsTable/StatisticsTable';
import StatisticsDashboard from '../../components/StatisticsDashboard/StatisticsDashboard';
import styles from './Statistics.module.css';

const StatisticsPage = () => {
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
