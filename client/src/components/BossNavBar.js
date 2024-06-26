import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import "../NavBar.css";

function BossNavBar({ logout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <img src="../logoDNF.png" alt="Company Logo" className="nav-logo" />

      <div className={`nav-links-container ${isOpen ? "open" : ""}`}>
        <NavLink
          to="/home"
          exact
          className="nav-link"
          activeClassName="active"
          onClick={handleNavItemClick}
        >
          <button>Home</button>
        </NavLink>
        <NavLink
          to="/employees"
          className="nav-link"
          activeClassName="active"
          onClick={handleNavItemClick}
        >
          <button>Employees</button>
        </NavLink>
        <NavLink
          to="/projects"
          className="nav-link"
          activeClassName="active"
          onClick={handleNavItemClick}
        >
          <button>Projects</button>
        </NavLink>
        <NavLink
          to="/expenses"
          className="nav-link"
          activeClassName="active"
          onClick={handleNavItemClick}
        >
          <button>Expenses</button>
        </NavLink>
        <NavLink
          to="/worklogs"
          className="nav-link"
          activeClassName="active"
          onClick={handleNavItemClick}
        >
          <button>Worklogs</button>
        </NavLink>
        <Logout logout={logout} onClick={handleNavItemClick} />
      </div>

      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}

export default BossNavBar;
