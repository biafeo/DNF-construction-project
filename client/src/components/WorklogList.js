import React, { useState, useEffect } from "react";
import WorklogFormEdit from "./WorklogFormEdit";

function WorklogList() {
  const [worklogs, setWorklogs] = useState([]);
  const [editWorklog, setEditWorklog] = useState(null);

  useEffect(() => {
    fetch("/worklogs")
      .then((r) => r.json())
      .then((data) => {
        setWorklogs(data);
      });
  }, []);

  const handleEditWorklog = (updatedWorklog) => {
    setWorklogs(
      worklogs.map((worklog) =>
        worklog.id === updatedWorklog.id ? updatedWorklog : worklog
      )
    );
    setEditWorklog(null);
  };

  const handleDeleteWorklog = (worklogId) => {
    setWorklogs(worklogs.filter((worklog) => worklog.id !== worklogId));
    fetch(`/worklogs/${worklogId}`, { method: "DELETE" }).then(() => {});
  };

  const handleTogglePaidStatus = (worklog) => {
    const updatedWorklog = { ...worklog, paid: !worklog.paid };
    fetch(`/worklogs/${worklog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paid: updatedWorklog.paid }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update paid status");
      })
      .then((data) => {
        setWorklogs(worklogs.map((w) => (w.id === worklog.id ? data : w)));
      })
      .catch((error) => {
        console.error("Error updating paid status:", error);
      });
  };

  return (
    <div className="worklog-container">
      <h1>Worklogs</h1>
      <div className="worklogs-list">
        {worklogs.map((worklog) => (
          <div key={worklog.id} className="worklog-card">
            <h3>Employee ID: {worklog.employee_id}</h3>
            <h3>Project ID: {worklog.project_id}</h3>
            <h3>Hours Worked: {worklog.hours_worked}</h3>
            <h3>Date: {new Date(worklog.date).toLocaleDateString()}</h3>
            <h3>Paid: {worklog.paid ? "Yes" : "No"}</h3>
            <div className="button-container">
              <button onClick={() => setEditWorklog(worklog)}>Edit</button>
              <button onClick={() => handleDeleteWorklog(worklog.id)}>
                Delete
              </button>
              <button onClick={() => handleTogglePaidStatus(worklog)}>
                {worklog.paid ? "Unmark as Paid" : "Mark as Paid"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {editWorklog && (
        <WorklogFormEdit
          onEditWorklog={handleEditWorklog}
          worklog={editWorklog}
        />
      )}
    </div>
  );
}

export default WorklogList;
