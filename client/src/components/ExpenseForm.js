import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [projectId, setProjectId] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const newExpense = {
      description,
      amount,
      project_id: projectId,
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
        setProjectId("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <br />
      <input
        type="text"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        placeholder="Project ID"
      />
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
