import React, { createContext, useState, useEffect } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const getEmployees = () => {
    fetch("/employees")
      .then((r) => r.json())
      .then((data) => {
        setEmployees(data);
      });
  };

  const getCurrentEmployee = (id) => {
    fetch(`/employees/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCurrentEmployee(data);
      });
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setIsEditing(false);
  };

  const handleEditEmployee = (updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    if (currentEmployee && currentEmployee.id === updatedEmployee.id) {
      setCurrentEmployee(updatedEmployee);
    }
    setIsEditing(false);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter((employee) => employee.id !== employeeId));
    fetch(`/employees/${employeeId}`, { method: "DELETE" });
    if (currentEmployee && currentEmployee.id === employeeId) {
      setCurrentEmployee(null);
    }
    setIsEditing(false);
  };

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        currentEmployee,
        isEditing,
        handleAddEmployee,
        handleEditEmployee,
        handleDeleteEmployee,
        handleEditClick,
        setIsEditing,
        getEmployees,
        getCurrentEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
