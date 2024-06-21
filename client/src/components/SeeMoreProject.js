import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectFormEdit from "./ProjectFormEdit";

function SeeMoreProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        setEditProject(data);
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
      });
  }, [id]);

  const handleEditProject = (updatedProject) => {
    setProject(updatedProject);
    setEditProject(null);
    setFormVisible(false);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  const {
    name,
    location,
    description,
    material_expenses,
    employee_expenses,
    contract_payment,
  } = project;

  const totalExpense = material_expenses + employee_expenses;
  const profit = contract_payment - totalExpense;

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <>
      <div>
        <div className="employee-info">
          <div>
            <h1>{name}</h1>
          </div>
          <div>
            <h3>Location: {location}</h3>
            <h3>Description: {description}</h3>
            <h3>Material Expenses: {material_expenses}</h3>
            <h3>Employee Expenses: {employee_expenses}</h3>
            <h3>Contract Payment: {contract_payment}</h3>
            <h3>Total Expenses: {totalExpense}</h3>
            <h3>Profit: {profit}</h3>
          </div>
        </div>
        <button onClick={toggleForm} className="toggle-button">
          {isFormVisible ? "Cancel" : "Edit Project"}
        </button>
        {isFormVisible && (
          <ProjectFormEdit
            onEditProject={handleEditProject}
            project={editProject}
          />
        )}
      </div>
    </>
  );
}

export default SeeMoreProject;
