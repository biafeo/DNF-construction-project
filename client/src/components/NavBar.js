import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import "../NavBar.css";

function NavBar({ logout, user }) {
  return (
    <nav className="navbar">
      <img src="../logoDNF.png" alt="Company Logo" className="nav-logo" />
      <div className="nav-links-container">
        <NavLink
          to="/home/employee"
          exact
          className="nav-link"
          activeClassName="active"
        >
          <button className="nav-link button">Home</button>
        </NavLink>
        {
          <NavLink to={`/employee/${user.id}`}>
            <button className="nav-link button">My profile</button>
          </NavLink>
        }
        <Logout logout={logout} />
      </div>
    </nav>
  );
}

export default NavBar;
