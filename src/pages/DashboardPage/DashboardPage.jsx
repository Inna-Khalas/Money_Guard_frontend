import CurrencyTab from "../CurrencyTab/CurrencyTab";
import Navigation from '../../components/Navigation/Navigation';

export default function DashboardPage() {
  return (
    <>
      <div>
        <Navigation />
      </div>
      <div>
        <CurrencyTab />
      </div>
    </>
  );
}