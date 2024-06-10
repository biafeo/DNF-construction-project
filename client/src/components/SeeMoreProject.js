import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SeeMoreProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const { name, location, description, material_expenses, employee_expenses } =
    project;

  return (
    <div className="see-more-project-card-container">
      <div>
        <h1>{name}</h1>
      </div>
      <div>
        <h3>Location: {location}</h3>
        <h3>Description: {description}</h3>
        <h3>Material Expenses: {material_expenses}</h3>
        <h3>Employee Expenses: {employee_expenses}</h3>
      </div>
    </div>
  );
}

export default SeeMoreProject;
