/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import { ContextProvider } from "helpers/context";

// core components
import Admin from "layouts/Admin.js";
import Login from "views/Auth/Login.js";
import ResetForm from "views/PasswordReset/ResetForm";
import NewPassword from "views/PasswordReset/NewPassword";
import EmailVerification from "views/Auth/EmailVerification";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";

import Rights from "views/Auth/Rights.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();

global.PROJECT_ID = "5ac12a8225e16";

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/rights" component={Rights} />

      <Route path="/login" component={Login} />
      <Route path="/remind-password" component={ResetForm} />
      <Route path="/remind-password-new/:token" component={NewPassword} />
      <Route path="/email-verification" component={EmailVerification} />

      <ContextProvider>
        <ProtectedRoute path="/" component={Admin} />
      </ContextProvider>
    </Switch>
  </Router>,
  document.getElementById("root")
);
