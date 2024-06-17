import React from "react";
import { useHistory } from "react-router-dom";

function Logout({ setEmployee }) {
  const history = useHistory();

  const handleLogout = () => {
    fetch("/sign_out", {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        setEmployee(null);
        sessionStorage.removeItem("isAuthenticated");
        history.push("/");
      }
    });
  };

  return (
    <button type="button" onClick={handleLogout}>
      Log Out
    </button>
  );
}

export default Logout;
