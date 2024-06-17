import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";

function BossNavBar() {
  const [employee, setEmployee] = useState(null);

  return (
    <nav className="navbar">
      <div className="nav-links-container">
        <NavLink to="/home" exact className="nav-link" activeClassName="active">
          <button>Home</button>
        </NavLink>
        <NavLink to="/employees" className="nav-link" activeClassName="active">
          <button>Employees</button>
        </NavLink>
        <NavLink to="/projects" className="nav-link" activeClassName="active">
          <button>Projects</button>
        </NavLink>
        <NavLink to="/expenses" className="nav-link" activeClassName="active">
          <button>Expenses</button>
        </NavLink>
        <NavLink to="/worklogs" className="nav-link" activeClassName="active">
          <button>Worklogs</button>
        </NavLink>
        <NavLink to="/sign_in">
          <button>Login</button>
        </NavLink>
        <Logout setEmployee={setEmployee} />
      </div>
    </nav>
  );
}

export default BossNavBar;
