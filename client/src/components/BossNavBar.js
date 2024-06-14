import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const handleLogout = (setEmployee) => {
  fetch("/sign_out", {
    method: "DELETE",
  }).then((res) => {
    if (res.ok) {
      setEmployee(null);
    }
  });
};

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
        <button type="button" onClick={() => handleLogout(setEmployee)}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default BossNavBar;
