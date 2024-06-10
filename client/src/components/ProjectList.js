import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import ProjectFormEdit from "./ProjectFormEdit";
import SeeMoreProject from "./SeeMoreProject";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);

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

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleEditProject = (updatedProject) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setEditProject(null);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId));
    fetch(`/projects/${projectId}`, { method: "DELETE" }).then(() => {});
  };

  return (
    <div className="project-container">
      <h1>My Projects</h1>
      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <div className="button-container">
              <Link to={`/projects/${project.id}`} className="button-link">
                View Project Details
              </Link>
              <button onClick={() => setEditProject(project)}>Edit</button>
              <button onClick={() => handleDeleteProject(project.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editProject && (
        <ProjectFormEdit
          onEditProject={handleEditProject}
          project={editProject}
        />
      )}
      <h3>Add Project:</h3>
      <ProjectForm onAddProject={handleAddProject} />
    </div>
  );
}

export default ProjectList;
