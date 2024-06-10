import { useState, useEffect } from "react";

function ProjectFormEdit({ project, onEditProject }) {
  const [name, setName] = useState(project.name);
  const [location, setLocation] = useState(project.location);
  const [description, setDescription] = useState(project.description);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setLocation(project.location);
      setDescription(project.description);
    }
  }, [project]);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedProject = {
      id: project.id,
      name,
      location,
      description,
    };

    fetch(`/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProject),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update");
      })
      .then((updatedProject) => {
        onEditProject(updatedProject);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <h3>Update {name}'s Information</h3>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <button type="submit">Update Project</button>
      </form>
    </div>
  );
}

export default ProjectFormEdit;
