import React, { useState, useContext } from "react";
import { EmployeeContext } from "./EmployeeContext";

function EmployeeForm() {
  const { handleAddEmployee } = useContext(EmployeeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [_password_hash, setPassword] = useState("");
  const [hourly_rate, setHourlyRate] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [isBoss, setIsBoss] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !address ||
      !_password_hash ||
      !hourly_rate ||
      !phone_number ||
      !isBoss
    ) {
      setError("All fields are required");
      return;
    }

    const newEmployee = {
      name,
      email,
      address,
      password: _password_hash,
      hourly_rate,
      phone_number,
      isBoss: isBoss === "true",
    };

    fetch("/api/employees", {
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
        throw new Error("Failed to add employee.");
      })
      .then((newEmployee) => {
        handleAddEmployee(newEmployee);
        setName("");
        setEmail("");
        setAddress("");
        setPassword("");
        setHourlyRate("");
        setPhoneNumber("");
        setIsBoss("");
        setError("");
      })
      .catch((err) => setError(err.message));
  }

  return (
    <form className="form-geral" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
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
        onChange={(e) => setHourlyRate(e.target.value)}
        placeholder="Hourly Rate"
      />
      <br />
      <input
        type="text"
        value={phone_number}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />
      <br />
      <select value={isBoss} onChange={(e) => setIsBoss(e.target.value)}>
        <option value="">Is admin?</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <br />
      <button type="submit">Add Employee</button>
    </form>
  );
}

export default EmployeeForm;
