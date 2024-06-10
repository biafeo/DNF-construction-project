import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import NavBar from "./NavBar";
import Homepage from "./Homepage";
import EmployeesList from "./EmployeesList";
import SeeMoreEmployee from "./SeeMoreEmployee";
import ProjectList from "./ProjectList";
import SeeMoreProject from "./SeeMoreProject";
import ExpensesList from "./ExpensesList";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/employees">
          <EmployeesList />
        </Route>
        <Route exact path="/employees/:id">
          <SeeMoreEmployee />
        </Route>
        <Route exact path="/projects">
          <ProjectList />
        </Route>
        <Route exact path="/projects/:id">
          <SeeMoreProject />
        </Route>
        <Route exact path="/expenses">
          <ExpensesList />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
