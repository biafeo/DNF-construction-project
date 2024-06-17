import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";

function EmployeePage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch(`/employees/${id}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Network response was not ok");
        }
        return r.json();
      })
      .then((data) => {
        data.work_logs = data.work_logs.filter((log) => !log.paid);
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
      });
  }, [id]);

  const calculateTotalPaymentAndHours = (logs, hourly_rate) => {
    return logs.reduce(
      (acc, log) => {
        if (!log.paid) {
          acc.totalPayment += log.hours_worked * hourly_rate;
          acc.totalHours += log.hours_worked;
        }
        return acc;
      },
      { totalPayment: 0, totalHours: 0 }
    );
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const { name, email, address, hourly_rate, phone_number, work_logs } =
    employee;

  const { totalPayment, totalHours } = calculateTotalPaymentAndHours(
    work_logs,
    hourly_rate
  );

  return (
    <>
      <NavBar />
      <div className="see-more-employee-card-container">
        <div>
          <h1>{name}</h1>
        </div>
        <div>
          <h3>Email: {email}</h3>
          <h3>Address: {address}</h3>
          <h3>Hourly Rate: {hourly_rate}</h3>
          <h3>Phone number: {phone_number}</h3>
          <h3>Hours Worked: {totalHours}</h3>
          <h3>Total Payment: {totalPayment}</h3>
        </div>
        <div>
          <h3>Work Logs</h3>
          <ul>
            {work_logs.map((log) => (
              <li key={log.id}>
                <p>Date: {log.date}</p>
                <p>Project: {log.project_name}</p>
                <p>Hours Worked: {log.hours_worked}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default EmployeePage;
