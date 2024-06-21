import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import ProjectFormEdit from "./ProjectFormEdit";
import SeeMoreProject from "./SeeMoreProject";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId));
    fetch(`/api/projects/${projectId}`, { method: "DELETE" }).then(() => {});
  };
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };
  return (
    <>
      <div className="project-container">
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="employees-card">
              <h3 className="styled-h32">{project.name}</h3>
              <div className="button-container">
                <Link to={`/projects/${project.id}`}>
                  <button className="button">View Details</button>
                </Link>

                <button
                  className="button"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={toggleForm} className="toggle-button">
          {isFormVisible ? "Cancel" : "Add Project"}
        </button>
        {isFormVisible && <ProjectForm onAddProject={handleAddProject} />}
      </div>
    </>
  );
}

export default ProjectList;
