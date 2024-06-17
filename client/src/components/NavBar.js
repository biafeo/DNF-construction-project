import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";

function NavBar() {
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("employee"));
    if (storedEmployee && storedEmployee.id) {
      setEmployeeId(storedEmployee.id);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-links-container">
        <NavLink
          to="/home/employee"
          exact
          className="nav-link"
          activeClassName="active"
        >
          <button>Home</button>
        </NavLink>
        {employeeId && (
          <NavLink to={`/employee/${employeeId}`}>
            <button>My profile</button>
          </NavLink>
        )}
        <Logout setEmployee={setEmployeeId} />
      </div>
    </nav>
  );
}

export default NavBar;
