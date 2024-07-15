import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ExpenseFormEdit from "./ExpenseFormEdit";

function SeeMoreExpenses() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  useEffect(() => {
    fetch(`/api/expenses/${id}`)
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
    setFormVisible(false);
  };

  const { amount, description, project } = expense;

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="employee-info">
          <div>
            <h1>{description}</h1>
          </div>
          <div>
            <h3>Amount: {amount}</h3>
            <h3>Project: {project ? project.name : "No project assigned"}</h3>
            <button onClick={toggleForm} className="toggle-button">
              {isFormVisible ? "Cancel" : "Edit Expense"}
            </button>
            {isFormVisible && (
              <ExpenseFormEdit
                onEditExpense={handleEditExpense}
                expense={expense}
              />
            )}
          </div>
        </div>
      </div>
      <footer id="footer">
        <h1>DNF Construction</h1>
        <p> Copyright &copy; 2024 Beatriz Feo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SeeMoreExpenses;
