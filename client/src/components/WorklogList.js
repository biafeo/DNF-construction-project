import React, { useState, useEffect } from "react";
import WorklogFormEdit from "./WorklogFormEdit";

function WorklogList() {
  const [worklogs, setWorklogs] = useState([]);
  const [editWorklogId, setEditWorklogId] = useState(null);

  useEffect(() => {
    fetch("/api/worklogs")
      .then((r) => r.json())
      .then((data) => {
        const formattedData = data.map((worklog) => ({
          ...worklog,
          date: formatDate(worklog.date),
        }));
        setWorklogs(formattedData);
      });
  }, []);

  const handleEditWorklog = (updatedWorklog) => {
    setWorklogs(
      worklogs.map((worklog) =>
        worklog.id === updatedWorklog.id ? updatedWorklog : worklog
      )
    );
    setEditWorklogId(null);
  };

  const handleDeleteWorklog = (worklogId) => {
    setWorklogs(worklogs.filter((worklog) => worklog.id !== worklogId));
    fetch(`/api/worklogs/${worklogId}`, { method: "DELETE" }).then(() => {});
  };

  const handleTogglePaidStatus = (worklog) => {
    const updatedWorklog = { ...worklog, paid: !worklog.paid };
    fetch(`/api/worklogs/${worklog.id}`, {
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  }

  return (
    <>
      <div className="worklog-container">
        <div className="worklogs-list">
          {worklogs.map((worklog) => (
            <div key={worklog.id} className="worklog-card">
              <h3>{worklog.employee_name}</h3>
              <h3>{worklog.project_name}</h3>
              <h3>{worklog.hours_worked}hrs</h3>
              <h3>{worklog.date}</h3>
              <h3>Paid: {worklog.paid ? "Yes" : "No"}</h3>
              <div className="button-container">
                <button
                  className="button"
                  onClick={() =>
                    setEditWorklogId(
                      editWorklogId === worklog.id ? null : worklog.id
                    )
                  }
                >
                  {editWorklogId === worklog.id ? "Cancel" : "Edit"}
                </button>
                {editWorklogId === worklog.id && (
                  <WorklogFormEdit
                    onEditWorklog={handleEditWorklog}
                    worklog={worklog}
                  />
                )}
                <button
                  className="button"
                  onClick={() => handleDeleteWorklog(worklog.id)}
                >
                  Delete
                </button>
                <button
                  className="button"
                  onClick={() => handleTogglePaidStatus(worklog)}
                >
                  {worklog.paid ? "Unmark as Paid" : "Mark as Paid"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WorklogList;
