import React from "react";
import { Route, Redirect } from "react-router-dom";
import { any } from "prop-types";

import { isAllowed } from "helpers/routeChecker";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const token = localStorage.getItem("token");
        const expire = localStorage.getItem("expire") || Math.floor(new Date());
        const currentDate = Math.floor(new Date().getTime() / 1000);

        if (token && (expire > currentDate)) {
          return isAllowed(props.location.pathname) ? (
            <Component {...props} />
          ) : (
            <Redirect to="/404" />
          );
        }
        else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("expire");
        }
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  component: any
};

export default ProtectedRoute;
