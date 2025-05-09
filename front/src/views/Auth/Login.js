import React, { useState, useRef } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { object } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

import axiosInstance from "config/axiosInstance";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Muted from "components/Typography/Muted.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";
import useSubmitOnEnter from "helpers/useSubmitOnEnter";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  }
};

const useStyles = makeStyles(styles);

const Login = ({ location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("This is fine");
  const [isLoading, setIsLoading] = useState(false);

  const notificationRef = useRef(null);
  const classes = useStyles();
  const history = useHistory();

  const { from } = location.state || { from: { pathname: "/" } };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = () => {
    if (isLoading) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    axiosInstance
      .post(`/auth`, formData)
      .then(response => {
        const token = response?.data?.data?.session?.access_token || "";
        const refreshToken = response?.data?.data?.session?.refresh_token || "";
        const expire = response?.data?.data?.session?.expires_in || 0;
        if (token && refreshToken) {
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem(
            "user",
            JSON.stringify(response?.data?.data?.user)
          );

          const expireDate = Math.floor(new Date().getTime() / 1000 + expire);
          localStorage.setItem("expire", expireDate);

          history.push(from);
        } else {
          setStatus("");
          setMessage("Something wrong with the response structure");
          return notificationRef?.current?.showNotification();
        }
      })
      .catch(error => {
        setStatus("danger");
        const { message, validationErrors } = error?.response?.data;
        let newMessage = message;
        if (message === "Validation error" && validationErrors) {
          newMessage = Object.keys(validationErrors)
            .map(key => validationErrors[key])
            .join(`\r\n`);
        }
        setMessage(newMessage || "Something went wrong");
        return notificationRef?.current?.showNotification();
      })
      .finally(() => setIsLoading(false));
  };

  useSubmitOnEnter(handleSubmit);

  if (localStorage.getItem("token")) {
    return <Redirect to={from} />;
  }

  return (
    <div className={classes.wrapper}>
      <GridContainer
        justify="center"
        style={{ minHeight: "100vh", width: "100%" }}
        alignContent="center"
      >
        <GridItem xs={12} sm={8} md={6} lg={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Login</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={email}
                    onChange={handleChange}
                    inputProps={{
                      type: "email",
                      name: "email",
                      required: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={password}
                    onChange={handleChange}
                    inputProps={{
                      type: "password",
                      name: "password",
                      required: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Muted>
                <Link href="/remind-password" variant="body2">
                  Forgot password?
                </Link>
              </Muted>
              <Button
                color="primary"
                type="submit"
                onClick={handleSubmit}
                xs={12}
                sm={12}
                md={12}
                disabled={!email.length || !password.length || isLoading}
              >
                Login
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <PopupNotification
        ref={notificationRef}
        status={status}
        message={message}
      />
    </div>
  );
};

Login.propTypes = {
  location: object
};

export default Login;
