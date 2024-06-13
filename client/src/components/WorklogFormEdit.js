import { useState, useEffect } from "react";

function WorklogFormEdit({ worklog, onEditWorklog }) {
  const [employee, setEmployee] = useState(worklog.employee_id);
  const [project, setProject] = useState(worklog.project_id);
  const [hours_worked, setHours_worked] = useState(worklog.hours_worked);
  const [date, setDate] = useState(worklog.date);

  useEffect(() => {
    if (worklog) {
      setEmployee(worklog.employee_id);
      setProject(worklog.project_id);
      setHours_worked(worklog.hours_worked);
      setDate(worklog.date);
    }
  }, [worklog]);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedWorklog = {
      id: worklog.id,
      employee_id: employee,
      project_id: project,
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
        <input
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          placeholder="Employee"
        />
        <input
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="Project"
        />
        <input
          type="text"
          value={hours_worked}
          onChange={(e) => setHours_worked(e.target.value)}
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
