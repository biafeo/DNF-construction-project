import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import "../NavBar.css";

function NavBar({ logout, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <img src="../logoDNF.png" alt="Company Logo" className="nav-logo" />
      <div className={`nav-links-container ${isOpen ? "open" : ""}`}>
        <NavLink
          to="/home/employee"
          exact
          className="nav-link"
          activeClassName="active"
        >
          <button className="nav-link button">Home</button>
        </NavLink>
        <NavLink to={`/employee/${user.id}`} className="nav-link">
          <button className="nav-link button">My Profile</button>
        </NavLink>
        <Logout logout={logout} />
      </div>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}

export default NavBar;
