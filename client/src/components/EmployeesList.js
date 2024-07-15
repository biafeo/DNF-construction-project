import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import { EmployeeContext } from "./EmployeeContext";

function EmployeesList() {
  const { employees, handleAddEmployee, handleDeleteEmployee, getEmployees } =
    useContext(EmployeeContext);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="employees-container">
          <div className="employees-list">
            {Array.isArray(employees) && employees.length > 0 ? (
              employees.map((employee) => (
                <div key={employee.id} className="employees-card">
                  <h3 className="styled-h32">{employee.name}</h3>
                  <div className="button-container">
                    <Link to={`/employees/${employee.id}`}>
                      <button className="button">View Employee Details</button>
                    </Link>
                    <button
                      className="button"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No employees found</p>
            )}
          </div>
          <button onClick={toggleForm} className="toggle-button">
            {isFormVisible ? "Cancel" : "Add Employee"}
          </button>
          {isFormVisible && <EmployeeForm onAddEmployee={handleAddEmployee} />}
        </div>
      </div>
      <footer id="footer">
        <h1>DNF Construction</h1>
        <p> Copyright &copy; 2024 Beatriz Feo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeesList;
