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
      <div className="page-container">
        <div className="content-wrap">
          <div className="worklog-container">
            <div className="worklogs-list">
              {worklogs.map((worklog) => (
                <div key={worklog.id} className="worklogs-info">
                  <div className="worklog-icon">
                    <img src="/worklog2.jpeg" alt="Address icon" />
                    <h3 className="h3-expense">{worklog.employee_name}</h3>
                  </div>
                  <div className="worklog-icon">
                    <img src="/worklog3.jpeg" alt="Address icon" />
                    <h3>{worklog.project_name}</h3>
                  </div>
                  <div className="worklog-icon">
                    <img src="/worklog4.jpeg" alt="Address icon" />
                    <h3>{worklog.hours_worked}hrs</h3>
                  </div>
                  <div className="worklog-icon">
                    <img src="/worklog5.jpeg" alt="Address icon" />
                    <h3>{worklog.date}</h3>
                  </div>
                  <div className="worklog-icon">
                    <img src="/worklog1.jpeg" alt="Address icon" />
                    <h3>Paid: {worklog.paid ? "Yes" : "No"}</h3>
                  </div>
                  <div className="worklogs-button-container">
                    <button
                      className="worklogs-button"
                      onClick={() =>
                        setEditWorklogId(
                          editWorklogId === worklog.id ? null : worklog.id
                        )
                      }
                    >
                      {editWorklogId === worklog.id ? "Cancel" : "Edit"}
                    </button>
                    <button
                      className="worklogs-button"
                      onClick={() => handleDeleteWorklog(worklog.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="worklogs-button"
                      onClick={() => handleTogglePaidStatus(worklog)}
                    >
                      {worklog.paid ? "Paid" : "Not Paid"}
                    </button>
                  </div>
                  {editWorklogId === worklog.id && (
                    <div className="worklog-edit-form">
                      <WorklogFormEdit
                        onEditWorklog={handleEditWorklog}
                        worklog={worklog}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer id="footer">
          <h1>DNF Construction</h1>
          <p> Copyright &copy; 2024 Beatriz Feo. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default WorklogList;
