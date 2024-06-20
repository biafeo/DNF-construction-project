import { useState, useEffect } from "react";

function WorklogFormEdit({ worklog, onEditWorklog }) {
  const [employee, setEmployee] = useState(worklog.employee_id);
  const [project, setProject] = useState(worklog.project_id);
  const [hours_worked, setHoursWorked] = useState(worklog.hours_worked);
  const [date, setDate] = useState(worklog.date);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (worklog) {
      setEmployee(worklog.employee_id);
      setProject(worklog.project_id);
      setHoursWorked(worklog.hours_worked);
      setDate(worklog.date);
    }
  }, [worklog]);

  useEffect(() => {
    fetch("/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedWorklog = {
      id: worklog.id,
      employee_id: employee,
      project_id: project === "" ? null : project,
      hours_worked,
      date,
    };

    fetch(`/worklogs/${worklog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWorklog),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update");
      })
      .then((updatedWorklog) => {
        onEditWorklog(updatedWorklog);
      })
      .catch((error) => {
        console.error("Error updating worklog:", error);
      });
  }

  return (
    <div>
      <h3>Update Worklog Information</h3>
      <form onSubmit={handleSubmit} className="form">
        <select
          value={project || ""}
          onChange={(e) => setProject(e.target.value)}
        >
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
