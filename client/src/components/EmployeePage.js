import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";

function EmployeePage({ user, setUser }) {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    hourly_rate: "",
    phone_number: "",
  });
  useEffect(() => {
    fetch(`/employees/${id}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Network response was not ok");
        }
        return r.json();
      })
      .then((data) => {
        data.work_logs = data.work_logs.filter((log) => !log.paid);
        setEmployee(data);
        setFormData({
          name: data.name,
          email: data.email,
          address: data.address,
          password: data.password,
          hourly_rate: data.hourly_rate,
          phone_number: data.phone_number,
        });
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
      });
  }, [id]);

  const handleEditEmployee = (updatedEmployee) => {
    setEmployee(updatedEmployee);
    setEditMode(false);
    setUser(updatedEmployee);
  };

  if (user.id != id) {
    return <Redirect to="/home/employee" />;
  }

  const calculateTotalPaymentAndHours = (logs, hourly_rate) => {
    return logs.reduce(
      (acc, log) => {
        if (!log.paid) {
          acc.totalPayment += log.hours_worked * hourly_rate;
          acc.totalHours += log.hours_worked;
        }
        return acc;
      },
      { totalPayment: 0, totalHours: 0 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/employees/${employee.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update");
      })
      .then((updatedEmployee) => {
        handleEditEmployee(updatedEmployee);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const { name, email, address, hourly_rate, phone_number, work_logs } =
    employee;

  const { totalPayment, totalHours } = calculateTotalPaymentAndHours(
    work_logs,
    hourly_rate
  );

  return (
    <>
      <div className="see-more-employee-card-container">
        <div>
          <h1>{name}</h1>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
        <div>
          <h3>Email: {email}</h3>
          <h3>Address: {address}</h3>
          <h3>Hourly Rate: {hourly_rate}</h3>
          <h3>Phone number: {phone_number}</h3>
          <h3>Hours Worked: {totalHours}</h3>
          <h3>Total Payment: {totalPayment}</h3>
        </div>
        <div>
          <h3>Work Logs</h3>
          <ul>
            {work_logs.map((log) => (
              <li key={log.id}>
                <p>Date: {log.date}</p>
                <p>Project: {log.project_name}</p>
                <p>Hours Worked: {log.hours_worked}</p>
              </li>
            ))}
          </ul>
        </div>
        {editMode && (
          <div>
            <h3>Update {name}'s Information</h3>
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />

              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <button type="submit">Update Employee</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default EmployeePage;
