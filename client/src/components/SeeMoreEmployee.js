import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EmployeeFormEdit from "./EmployeeFormEdit";

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

    fetch("/projects")
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
                <p>Paid: {log.paid ? "Yes" : "No"}</p>
                {!log.paid && (
                  <button
                    onClick={() => handleTogglePaidStatus(log.id, log.paid)}
                  >
                    Mark as Paid
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleAddHours}>
          <h3>Add Hours Worked</h3>
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
          <button type="submit">Add Hours</button>
        </form>
        <button onClick={() => setShowEditForm(!showEditForm)}>
          {showEditForm ? "Hide Edit Form" : "Show Edit Form"}
        </button>
        {showEditForm && (
          <EmployeeFormEdit employee={employee} onEditEmployee={setEmployee} />
        )}
      </div>
    </>
  );
}

export default SeeMoreEmployee;
