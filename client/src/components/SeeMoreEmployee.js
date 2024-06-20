import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EmployeeFormEdit from "./EmployeeFormEdit";
import "./SeeMoreEmployee.css";

function SeeMoreEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetch(`/employees/${id}`)
      .then((r) => r.json())
      .then((data) => {
        data.work_logs = data.work_logs.filter((log) => !log.paid);
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
      });

    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [id]);

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

  const handleAddHours = (e) => {
    e.preventDefault();

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const hoursToAdd = (end - start) / 1000 / 60 / 60;

    if (hoursToAdd <= 0) {
      alert("Invalid time range. Please check the start and end times.");
      return;
    }

    const selectedProject = projects.find(
      (project) => project.name === selectedProjectName
    );

    fetch(`/employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hours_worked: hoursToAdd,
        project_id: selectedProject ? selectedProject.id : null,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update hours worked");
      })
      .then((updatedEmployee) => {
        updatedEmployee.work_logs = updatedEmployee.work_logs.filter(
          (log) => !log.paid
        );
        setEmployee(updatedEmployee);
        setStartTime("");
        setEndTime("");
        setSelectedProjectName("");
      })
      .catch((error) => {
        console.error("Error updating hours worked:", error);
      });
  };

  const handleTogglePaidStatus = (workLogId, currentStatus) => {
    fetch(`/worklogs/${workLogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paid: !currentStatus }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update paid status");
      })
      .then((updatedLog) => {
        setEmployee((prev) => {
          const updatedLogs = prev.work_logs
            .map((log) => (log.id === workLogId ? updatedLog : log))
            .filter((log) => !log.paid);
          return { ...prev, work_logs: updatedLogs };
        });
      })
      .catch((error) => {
        console.error("Error updating paid status:", error);
      });
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const calculatePaymentForLogs = (logs, hourly_rate) => {
    return logs.map((log) => ({
      ...log,
      payment: log.hours_worked * hourly_rate,
    }));
  };

  const { name, email, address, hourly_rate, phone_number, work_logs } =
    employee;
  const { totalPayment, totalHours } = calculateTotalPaymentAndHours(
    work_logs,
    hourly_rate
  );
  const workLogsWithPayments = calculatePaymentForLogs(work_logs, hourly_rate);

  return (
    <div className="employee-page-container">
      <div className="employee-info">
        <h1>{name}</h1>
        <div className="profile-card-container">
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
          <div>
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="toggle-button"
            >
              {showEditForm ? "Cancel" : "Edit"}
            </button>
            {showEditForm && (
              <EmployeeFormEdit
                employee={employee}
                onEditEmployee={(updatedEmployee) => {
                  updatedEmployee.work_logs = updatedEmployee.work_logs.filter(
                    (log) => !log.paid
                  );
                  setEmployee(updatedEmployee);
                  setShowEditForm(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="worklogs">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Hours Worked</th>
              <th>Payment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {workLogsWithPayments.map((log) => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.project_name}</td>
                <td>{log.hours_worked}</td>
                <td>${log.payment.toFixed(2)}</td>
                {!log.paid && (
                  <td>
                    <button
                      onClick={() => handleTogglePaidStatus(log.id, log.paid)}
                      className="paid-button"
                    >
                      Mark as Paid
                    </button>
                  </td>
                )}
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
        <form className="form-hours" onSubmit={handleAddHours}>
          <label>
            Worked from:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Until:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Project:
            <select
              value={selectedProjectName}
              onChange={(e) => setSelectedProjectName(e.target.value)}
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit" className="add-hours-button">
            Add Hours
          </button>
        </form>
      </div>
    </div>
  );
}

export default SeeMoreEmployee;
