import React, { useState } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import Homepage from "./Homepage";
import EmployeesList from "./EmployeesList";
import SeeMoreEmployee from "./SeeMoreEmployee";
import ProjectList from "./ProjectList";
import SeeMoreProject from "./SeeMoreProject";
import ExpensesList from "./ExpensesList";
import WorklogList from "./WorklogList";
import SeeMoreExpenses from "./SeeMoreExpenses";
import Login from "./Login";
import BossHomePage from "./BossHomePage";
import EmployeePage from "./EmployeePage";
import EmployeeHomepage from "./EmployeeHomepage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("isAuthenticated")
  );

  const handleLogin = (authStatus) => {
    setIsAuthenticated(authStatus);
    if (authStatus) {
      sessionStorage.setItem("isAuthenticated", "true");
    } else {
      sessionStorage.removeItem("isAuthenticated");
    }
  };

  return (
    <Router>
      <div className="wrapper">
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/sign_in">
            <Login onLogin={handleLogin} />
          </Route>
          <Route exact path="/employees">
            {isAuthenticated ? <EmployeesList /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/employees/:id">
            {isAuthenticated ? <SeeMoreEmployee /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/projects">
            {isAuthenticated ? <ProjectList /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/projects/:id">
            {isAuthenticated ? <SeeMoreProject /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/expenses">
            {isAuthenticated ? <ExpensesList /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/expenses/:id">
            {isAuthenticated ? <SeeMoreExpenses /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/worklogs">
            {isAuthenticated ? <WorklogList /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/home">
            {isAuthenticated ? <BossHomePage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/home/employee">
            {isAuthenticated ? <EmployeeHomepage /> : <Redirect to="/" />}
          </Route>
          <Route exact path="/employee/:id">
            {isAuthenticated ? <EmployeePage /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
