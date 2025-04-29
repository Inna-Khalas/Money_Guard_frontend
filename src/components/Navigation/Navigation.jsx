import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useMedia } from '../../hooks/useMedia';
import { MdHome } from 'react-icons/md';
import { SlGraph } from 'react-icons/sl';
import { FaDollarSign } from 'react-icons/fa6';

import s from './Navigation.module.css';


const Navigation = () => {
  const { isMobile } = useMedia();

  const buildLinkClass = ({ isActive }) =>
    clsx(s.item, isActive && s.activeItem);

  return (
    <nav>
      <ul className={s.list}>
        <li>
          <NavLink className={buildLinkClass} to="/dashboard/home">
            <div className={s.wrapper}>
              <MdHome className={s.icon} />
            </div>
            {!isMobile && <span className={s.navText}>Home</span>}
          </NavLink>
        </li>
        <li>
          <NavLink className={buildLinkClass} to="/dashboard/statistics">
            <div className={s.wrapper}>
              <SlGraph className={s.icon} />
            </div>
            {!isMobile && <span className={s.navText}>Statistics</span>}
          </NavLink>
        </li>
        {isMobile && (
          <li>
            <NavLink className={buildLinkClass} to="/dashboard/currency">
              <div className={s.wrapper}>
                <FaDollarSign className={s.icon} />
              </div>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
