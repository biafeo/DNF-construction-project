import React, { useEffect, useState } from "react";
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
import { EmployeeProvider } from "./EmployeeContext";
import BossNavBar from "./BossNavBar";
import NavBarHome from "./NavBarHome";
import NavBar from "./NavBar";

function App() {
  const [user, setUser] = useState();

  const logout = () => {
    fetch("/api/sign_out", {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        setUser(null);
      }
    });
  };

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((user) => {
        if (user.id) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
  }, []);

  const isAuthenticated = !!user;

  if (user === undefined) {
    return null;
  }

  return (
    <EmployeeProvider>
      <Router>
        <div className="wrapper">
          {user ? (
            user.isBoss ? (
              <BossNavBar logout={logout} />
            ) : (
              <NavBar user={user} logout={logout} />
            )
          ) : (
            <NavBarHome />
          )}
          <Switch>
            <Route exact path="/">
              {user === null ? (
                <Homepage />
              ) : user.isBoss ? (
                <Redirect to="/home" />
              ) : (
                <Redirect to="/home/employee" />
              )}
            </Route>
            <Route exact path="/sign_in">
              <Login setUser={setUser} />
            </Route>
            <Route exact path="/employees">
              {isAuthenticated ? (
                user.isBoss ? (
                  <EmployeesList />
                ) : (
                  <Redirect to="/" />
                )
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/employees/:id">
              {isAuthenticated ? (
                user.isBoss ? (
                  <SeeMoreEmployee />
                ) : (
                  <Redirect to="/home/employee" />
                )
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/projects">
              {isAuthenticated ? <ProjectList /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/projects/:id">
              {isAuthenticated ? (
                <SeeMoreProject />
              ) : (
                <Redirect to="/sign_in" />
              )}
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
              {isAuthenticated ? (
                <EmployeePage user={user} setUser={setUser} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
          </Switch>
        </div>
      </Router>
    </EmployeeProvider>
  );
}

export default App;
