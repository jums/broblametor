import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export const StatisticsMenu = () => {
  return (
    <ul className="nav nav-tabs mb-4">
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/">Stats</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/ticks">Ticks</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/sevens">Sevens</NavLink>
      </NavItem>
    </ul>
  );
}

export default StatisticsMenu;
