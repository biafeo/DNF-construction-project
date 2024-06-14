import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import ExpenseFormEdit from "./ExpenseFormEdit";
import BossNavBar from "./BossNavBar";

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    fetch("/expenses")
      .then((r) => r.json())
      .then((data) => {
        setExpenses(data);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const handleEditExpense = (updatedExpense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    setEditExpense(null);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter((expense) => expense.id !== expenseId));
    fetch(`/expenses/${expenseId}`, { method: "DELETE" }).then(() => {});
  };

  return (
    <>
      <BossNavBar />
      <div className="expense-container">
        <h1>My Expenses</h1>
        <div className="expenses-list">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-card">
              <h3>{expense.description}</h3>
              <div className="button-container">
                <Link to={`/expenses/${expense.id}`} className="button-link">
                  <button>View Expense Details</button>
                </Link>
                <button onClick={() => setEditExpense(expense)}>Edit</button>
                <button onClick={() => handleDeleteExpense(expense.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {editExpense && (
          <ExpenseFormEdit
            onEditExpense={handleEditExpense}
            expense={editExpense}
          />
        )}
        <h3>Add Expense:</h3>
        <ExpenseForm onAddExpense={handleAddExpense} />
      </div>
    </>
  );
}

export default ExpensesList;
