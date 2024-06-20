import { useState, useEffect } from "react";

function EmployeeFormEdit({ employee, onEditEmployee }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [hourly_rate, setHourlyRate] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setAddress(employee.address);
      setPassword(employee.password);
      setHourlyRate(employee.hourly_rate);
      setPhoneNumber(employee.phone_number);
    }
  }, [employee]);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedEmployee = {
      id: employee.id,
      name,
      email,
      address,
      password,
      hourly_rate,
      phone_number,
    };

    fetch(`/employees/${employee.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEmployee),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error("Failed to update");
      })
      .then((updatedEmployee) => {
        onEditEmployee(updatedEmployee);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  if (!employee) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="text"
          value={hourly_rate}
          onChange={(e) => setHourlyRate(e.target.value)}
          placeholder="Hourly Rate"
        />
        <input
          type="text"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
}

export default EmployeeFormEdit;
