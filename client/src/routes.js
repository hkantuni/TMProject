import React from "react";
import { Switch, Route } from "react-router-dom";
import { Timepage } from "./pages/Timepage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Newdata } from "./pages/newdata";
import { EditData } from "./pages/editdata";
import { Userpage } from "./pages/Userpage";
import { Edituser } from "./pages/Edituser";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/" exact>
          <Timepage />
        </Route>
        <Route path="/Newdata" exact>
          <Newdata />
        </Route>
        <Route path="/Userpage" exact>
          <Userpage />
        </Route>
        <Route path="/EditData/:id" exact>
          <EditData />
        </Route>
        <Route path="/Edituser/:id" exact>
          <Edituser />
        </Route>
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/Home" exact>
        <Home />
      </Route>
      <Route path="/Register" exact>
        <Register />
      </Route>
    </Switch>
  );
};
