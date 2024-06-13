import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ExpenseFormEdit from "./ExpenseFormEdit";

function SeeMoreExpenses() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    fetch(`/expenses/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setExpense(data);
      });
  }, [id]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  const handleEditExpense = (updatedExpense) => {
    setExpense(updatedExpense);
    setEditExpense(null);
  };

  const { amount, description, project } = expense;

  return (
    <div className="see-more-expense-card-container">
      <div>
        <h1>{description}</h1>
      </div>
      <div>
        <h3>Amount: {amount}</h3>
        <h3>Project: {project ? project.name : "No project assigned"}</h3>
        <button onClick={() => setEditExpense(expense)}>Edit</button>
        {editExpense && (
          <ExpenseFormEdit
            onEditExpense={handleEditExpense}
            expense={editExpense}
          />
        )}
      </div>
    </div>
  );
}

export default SeeMoreExpenses;
