import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-links-container">
        <NavLink to="/" exact className="nav-link" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/employees" className="nav-link" activeClassName="active">
          Employees
        </NavLink>
        <NavLink to="/projects" className="nav-link" activeClassName="active">
          Projects
        </NavLink>
        <NavLink to="/expenses" className="nav-link" activeClassName="active">
          Expenses
        </NavLink>
        <NavLink to="/worklogs" className="nav-link" activeClassName="active">
          Worklogs
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
