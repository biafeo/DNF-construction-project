import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import "./employeepage.css";

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
    fetch(`/api/employees/${id}`)
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
    updatedEmployee.work_logs = updatedEmployee.work_logs.filter(
      (log) => !log.paid
    );
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

  const calculatePaymentForLogs = (logs, hourly_rate) => {
    return logs.map((log) => ({
      ...log,
      payment: log.hours_worked * hourly_rate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/employees/${employee.id}`, {
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
  const workLogsWithPayments = calculatePaymentForLogs(work_logs, hourly_rate);

  return (
    <>
      <div className="employee-page-container">
        <div className="see-more-employee-card-container">
          <div className="employee-info">
            <div>
              <h1>{name}</h1>
            </div>
            <div>
              <div className="profile-card">
                <img src="/employee1.jpeg" alt="Experienced Team" />
                <h3>{email}</h3>
              </div>
              <div className="profile-card">
                <img src="/employee2.jpeg" alt="Experienced Team" />
                <h3>{phone_number}</h3>
              </div>
              <div className="profile-card">
                <img src="/employee3.jpeg" alt="Experienced Team" />
                <h3>{address}</h3>
              </div>
              <div className="profile-card">
                <img src="/employee4.jpeg" alt="Experienced Team" />
                <h3>${hourly_rate}/hr</h3>
              </div>
            </div>
            <button className="toggle-button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
          {editMode && (
            <div className="form-profile">
              <form onSubmit={handleSubmit} className="form profile-edit-form">
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
        <div className="worklogs">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Hours Worked</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {workLogsWithPayments.map((log) => (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td>{log.project_name}</td>
                  <td>{log.hours_worked}</td>
                  <td>${log.payment.toFixed(2)}</td>
                </tr>
              ))}

              <tr>
                <td colSpan="2">
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{totalHours}</strong>
                </td>
                <td>
                  <strong>${totalPayment.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default EmployeePage;
