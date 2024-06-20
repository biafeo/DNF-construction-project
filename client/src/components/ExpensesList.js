import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import ExpenseFormEdit from "./ExpenseFormEdit";

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };
  useEffect(() => {
    fetch("/api/expenses")
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
      <div className="expense-container">
        <div className="expenses-list">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-card">
              <h3>{expense.description}</h3>
              <div className="button-container">
                <Link to={`/expenses/${expense.id}`} className="button-link">
                  <button className="button">View Expense Details</button>
                </Link>

                <button
                  className="button"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
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
        <button onClick={toggleForm} className="toggle-button">
          {isFormVisible ? "Cancel" : "Add Expense"}
        </button>
        {isFormVisible && <ExpenseForm onAddExpense={handleAddExpense} />}
      </div>
    </>
  );
}

export default ExpensesList;
