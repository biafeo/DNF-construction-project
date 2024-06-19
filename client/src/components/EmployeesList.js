import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import { EmployeeContext } from "./EmployeeContext";

function EmployeesList() {
  const { employees, handleAddEmployee, handleDeleteEmployee, getEmployees } =
    useContext(EmployeeContext);

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <>
      <div className="employees-container">
        <div className="employees-list">
          {employees.map((employee) => (
            <div key={employee.id} className="employees-card">
              <h1>{employee.name}</h1>
              <div className="button-container">
                <Link to={`/employees/${employee.id}`} className="button">
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
          ))}
        </div>

        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </div>
    </>
  );
}

export default EmployeesList;
