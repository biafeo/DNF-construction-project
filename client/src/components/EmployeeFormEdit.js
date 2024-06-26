import { useState, useEffect } from "react";

function EmployeeFormEdit({ employee, onEditEmployee }) {
  const [name, setName] = useState(employee.name || "");
  const [email, setEmail] = useState(employee.email || "");
  const [address, setAddress] = useState(employee.address || "");
  const [password, setPassword] = useState("");
  const [hourly_rate, setHourlyRate] = useState(employee.hourly_rate || "");
  const [phone_number, setPhoneNumber] = useState(employee.phone_number || "");
  useEffect(() => {
    if (employee) {
      setName(employee.name || "");
      setEmail(employee.email || "");
      setAddress(employee.address || "");
      setHourlyRate(employee.hourly_rate || "");
      setPhoneNumber(employee.phone_number || "");
    }
  }, [employee]);

  function handleSubmit(e) {
    e.preventDefault();
    const updatedEmployee = {};
    if (name) updatedEmployee.name = name;
    if (email) updatedEmployee.email = email;
    if (address) updatedEmployee.address = address;
    if (password) updatedEmployee.password = password;
    if (hourly_rate) updatedEmployee.hourly_rate = hourly_rate;
    if (phone_number) updatedEmployee.phone_number = phone_number;

    fetch(`/api/employees/${employee.id}`, {
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
