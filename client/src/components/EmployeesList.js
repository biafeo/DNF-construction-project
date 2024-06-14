import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import EmployeeFormEdit from "./EmployeeFormEdit";
import SeeMoreEmployee from "./SeeMoreEmployee";
import BossNavBar from "./BossNavBar";

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    fetch("/employees")
      .then((r) => r.json())
      .then((data) => {
        setEmployees(data);
      });
  }, []);

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };

  const handleEditEmployee = (updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    setEditEmployee(null);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter((employee) => employee.id !== employeeId));
    fetch(`/employees/${employeeId}`, { method: "DELETE" });
  };

  return (
    <>
      <BossNavBar />
      <div className="employees-container">
        <h1>My Employees</h1>
        <div className="employees-list">
          {employees.map((employee) => (
            <div key={employee.id} className="employees-card">
              <h3>{employee.name}</h3>
              <div className="button-container">
                <Link to={`/employees/${employee.id}`} className="button-link">
                  <button>View Employee Details</button>
                </Link>
                <button onClick={() => setEditEmployee(employee)}>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {editEmployee && (
          <EmployeeFormEdit
            onEditEmployee={handleEditEmployee}
            employee={editEmployee}
          />
        )}
        <h3>Add Employees:</h3>
        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </div>
    </>
  );
}

export default EmployeesList;
