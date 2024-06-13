import { useState, useEffect } from "react";

function ExpenseFormEdit({ expense, onEditExpense }) {
  const [amount, setAmount] = useState(expense.amount);
  const [projectId, setProjectId] = useState(expense.project.id);
  const [description, setDescription] = useState(expense.description);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setProjectId(expense.project.id);
      setDescription(expense.description);
    }
  }, [expense]);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedExpense = {
      id: expense.id,
      amount,
      project_id: projectId,
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
      <h3>Update Expense Information</h3>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Project ID"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Update Expense</button>
      </form>
    </div>
  );
}

export default ExpenseFormEdit;
