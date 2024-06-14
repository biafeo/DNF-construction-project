import { useState } from "react";

function EmployeeForm({ onAddEmployee }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [_password_hash, setPassword] = useState("");
  const [hourly_rate, setHourly_rate] = useState("");
  const [phone_number, setPhone_number] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const newEmployee = {
      name,
      email,
      address,
      _password_hash,
      hourly_rate,
      phone_number,
    };

    fetch("/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to add");
      })
      .then((newEmployee) => {
        onAddEmployee(newEmployee);
        setName("");
        setEmail("");
        setAddress("");
        setPassword("");
        setHourly_rate("");
        setPhone_number("");
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <br />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      <br />
      <input
        type="text"
        value={_password_hash}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <br />
      <input
        type="text"
        value={hourly_rate}
        onChange={(e) => setHourly_rate(e.target.value)}
        placeholder="Hourly Rate"
      />
      <br />
      <input
        type="text"
        value={phone_number}
        onChange={(e) => setPhone_number(e.target.value)}
        placeholder="Phone Number"
      />
      <br />
      <button type="submit">Add Employee</button>
    </form>
  );
}

export default EmployeeForm;
