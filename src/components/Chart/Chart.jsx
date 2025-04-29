import { Chart as ChartJS, registerables } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import summarySelector from '../../redux/statistics/selectors';
import { selectBalance } from '../../redux/transactions/selectors';
import s from './Chart.module.css';

ChartJS.register(...registerables);

const coloredCategories = {
  Entertainment: '#ff85d2',
  Car: 'rgb(255, 104, 109)',
  Products: 'rgb(255, 157, 137)',
  'Main Expenses': 'rgb(254, 208, 87)',
  Leisure: 'rgb(91, 255, 167)',
  'Other Expenses': 'rgb(0, 173, 95)',
  Education: 'rgb(115, 222, 255)',
  'Self Care': 'rgb(170, 154, 255)',
  'Child Care': 'rgb(87, 101, 255)',
  'Household Products': 'rgb(114, 61, 239)',
};

export function Chart() {
  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isTablet = useMediaQuery({ minWidth: 768 });

  let doughnutSize = 280;

  if (isDesktop) {
    doughnutSize = 288;
  } else if (isTablet) {
    doughnutSize = 336;
  }

  const summary = useSelector(summarySelector);
  const balance = useSelector(selectBalance);
  const isLoading = useSelector(state => state.transactions.isLoading);

  const summaryOfPeriod = summary.categoriesSummary || [];

  const categoriesData = summaryOfPeriod.map(category => ({
    ...category,
    color: coloredCategories[category.name] || '#7a7878',
  }));

  const data = categoriesData.length
    ? {
        datasets: [
          {
            data: categoriesData.map(expense => expense.total),
            backgroundColor: categoriesData.map(expense => expense.color),
            boxShadow: '0px 0px 8px 0px #000 inset',
          },
        ],
      }
    : {
        datasets: [
          {
            data: [0.0001],
            backgroundColor: ['rgba(122, 120, 120, 0.7)'],
          },
        ],
      };

  const options = {
    cutout: '70%',
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    width: doughnutSize,
    height: doughnutSize,
  };

  return (
    <div
      className={s.chartContainer}
      style={{ width: `${doughnutSize}px`, height: `${doughnutSize}px` }}
    >
      <Doughnut data={data} options={options} className={s.chartWrapper} />
      <div className={s.doughnutContainer}>
        <span className={s.doughnutText}>
          {isLoading ? 'Loading...' : `₴ ${balance || 0}`}
        </span>
      </div>
    </div>
  );
}
