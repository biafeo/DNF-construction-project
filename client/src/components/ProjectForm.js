import { useState } from "react";

function ProjectForm({ onAddProject }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contract_payment, setContract_payment] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const newProject = {
      name,
      location,
      description,
      contract_payment,
    };

    fetch("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to add");
      })
      .then((newProject) => {
        onAddProject(newProject);
        setName("");
        setLocation("");
        setDescription("");
        setContract_payment("");
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <br />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <br />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="text"
        value={contract_payment}
        onChange={(e) => setContract_payment(e.target.value)}
        placeholder="Contract Payment"
      />
      <br />
      <button type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm;
