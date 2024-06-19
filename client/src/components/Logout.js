import React from "react";

function Logout({ logout }) {
  return (
    <button type="button" className="nav-link button" onClick={logout}>
      Log Out
    </button>
  );
}

export default Logout;
