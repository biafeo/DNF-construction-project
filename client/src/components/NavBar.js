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

function NavBar() {
  const [employee, setEmployee] = useState(null);

  return (
    <nav className="navbar">
      <div className="nav-links-container">
        <NavLink to="/" exact className="nav-link" activeClassName="active">
          <button> Home</button>
        </NavLink>
        <NavLink to="/sign_in" className="nav-link" activeClassName="active">
          <button> Login</button>
        </NavLink>
        <button type="button" onClick={() => handleLogout(setEmployee)}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
