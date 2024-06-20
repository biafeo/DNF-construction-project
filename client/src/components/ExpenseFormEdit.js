import { useState, useEffect } from "react";

function ExpenseFormEdit({ expense, onEditExpense }) {
  const [amount, setAmount] = useState(expense.amount);
  const [projects, setProjects] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(
    expense.project ? expense.project.name : ""
  );
  const [description, setDescription] = useState(expense.description);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setSelectedProjectName(expense.project ? expense.project.name : "");
      setDescription(expense.description);
    }
  }, [expense]);

  useEffect(() => {
    fetch("/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const selectedProject = projects.find(
      (project) => project.name === selectedProjectName
    );

    const updatedExpense = {
      id: expense.id,
      amount,
      project_id: selectedProject ? selectedProject.id : null,
      description,
    };

    fetch(`/expenses/${expense.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpense),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update");
      })
      .then((updatedExpense) => {
        onEditExpense(updatedExpense);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-geral">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select
          value={selectedProjectName}
          onChange={(e) => setSelectedProjectName(e.target.value)}
        >
          <option value="">Select a project (optional)</option>
          {projects.map((project) => (
            <option key={project.id} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Update Expense</button>
      </form>
    </div>
  );
}

export default ExpenseFormEdit;
