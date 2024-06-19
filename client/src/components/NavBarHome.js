import React from "react";
import "../NavBar.css";
import { NavLink } from "react-router-dom";

function NavBarHome() {
  return (
    <nav className="navbar">
      <img src="../logoDNF.png" alt="Company Logo" className="nav-logo" />
      <div className="nav-links-container">
        <NavLink exact to="/" activeClassName="active">
          <button className="nav-link-button">Home</button>
        </NavLink>
        <NavLink to="/#about-us" activeClassName="active">
          <button className="nav-link-button">About Us</button>
        </NavLink>
        <NavLink to="/#why-us" activeClassName="active">
          <button className="nav-link-button">Why Us?</button>
        </NavLink>
        <NavLink to="/#contact" activeClassName="active">
          <button className="nav-link-button">Contact</button>
        </NavLink>
        <NavLink to="/sign_in" activeClassName="active">
          <button className="nav-link-button">Login</button>
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBarHome;
