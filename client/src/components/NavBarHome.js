import React, { useState } from "react";
import "../NavBar.css";
import { NavLink } from "react-router-dom";
import { Link } from "react-scroll";

function NavBarHome() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <img src="../logoDNF.png" alt="Company Logo" className="nav-logo" />
      <div className={`nav-links-container ${isOpen ? "open" : ""}`}>
        <NavLink exact to="/" activeClassName="active">
          <button className="nav-link-button">Home</button>
        </NavLink>
        <Link to="about-us" smooth={true} duration={500}>
          <button className="nav-link-button">About Us</button>
        </Link>
        <Link to="why-us" smooth={true} duration={500}>
          <button className="nav-link-button">Why Us?</button>
        </Link>
        <Link to="contact" smooth={true} duration={500}>
          <button className="nav-link-button">Contact</button>
        </Link>
        <NavLink to="/sign_in" activeClassName="active">
          <button className="nav-link-button">Login</button>
        </NavLink>
      </div>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}

export default NavBarHome;
