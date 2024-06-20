import { useState, useEffect } from "react";

function ExpenseForm({ onAddExpense, onExpenseSuccess }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");

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

    const newExpense = {
      description,
      amount,
      project_id: selectedProject ? selectedProject.id : null,
    };

    fetch("/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to add");
      })
      .then((newExpense) => {
        onAddExpense(newExpense);
        setAmount("");
        setSelectedProjectName("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      });
  }

  return (
    <form className="form-geral" onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <br />
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
      <br />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <br />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
