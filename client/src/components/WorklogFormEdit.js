import { useState, useEffect } from "react";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function WorklogFormEdit({ worklog, onEditWorklog }) {
  const [employee, setEmployee] = useState(worklog.employee_id || "");
  const [project, setProject] = useState(worklog.project_id || "");
  const [hours_worked, setHoursWorked] = useState(worklog.hours_worked || "");
  const [date, setDate] = useState(formatDate(worklog.date) || "");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (worklog) {
      setEmployee(worklog.employee_id || "");
      setProject(worklog.project_id || "");
      setHoursWorked(worklog.hours_worked || "");
      setDate(formatDate(worklog.date) || "");
    }
  }, [worklog]);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedWorklog = {};

    if (employee !== "") updatedWorklog.employee_id = employee;
    if (project !== "") updatedWorklog.project_id = project;
    if (hours_worked !== "") updatedWorklog.hours_worked = hours_worked;
    if (date !== "") updatedWorklog.date = date;

    fetch(`/api/worklogs/${worklog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWorklog),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to update");
        }
        return r.json();
      })
      .then((data) => {
        onEditWorklog(data);
      })
      .catch((error) => {
        console.error("Error updating worklog:", error);
      });
  }

  return (
    <div>
      <h3>Update Worklog Information</h3>
      <form onSubmit={handleSubmit} className="form">
        <select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={hours_worked}
          onChange={(e) => setHoursWorked(e.target.value)}
          placeholder="Hours Worked"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />
        <button type="submit">Update Worklog</button>
      </form>
    </div>
  );
}

export default WorklogFormEdit;
