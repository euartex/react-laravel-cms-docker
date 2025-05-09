import React, { useState, useRef, useEffect } from "react";
import { object } from "prop-types";
import { Redirect, useParams, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import axiosInstance from "config/axiosInstance";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import PopupNotification from "components/PopupNotification/PopupNotification.js";

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

const NewPassword = ({ location }) => {
  const [new_password, setPassword] = useState("");
  const [new_password_confirmation, setConfirmationPassword] = useState("");

  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("This is fine");
  const [isLoading, setIsLoading] = useState(false);

  let { token } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const notificationRef = useRef(null);

  const { from } = location.state || { from: { pathname: "/" } };

  if (localStorage.getItem("token")) {
    return <Redirect to={from} />;
  }

  return (
    <div className={classes.wrapper}>
      <GridContainer
        justify="center"
        style={{ minHeight: "100vh" }}
        alignContent="center"
      >
        <GridItem xs={12} sm={8} md={6} lg={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Set new password</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="New password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={new_password}
                    onChange={({ target }) => setPassword(target.value)}
                    inputProps={{
                      type: "password",
                      name: "new_password",
                      required: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Confirm new password"
                    id="confirm-password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={new_password_confirmation}
                    onChange={({ target }) =>
                      setConfirmationPassword(target.value)
                    }
                    inputProps={{
                      type: "password",
                      name: "new_password_confirmation",
                      required: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                color="primary"
                type="submit"
                onClick={() => {
                  if (new_password !== new_password_confirmation) {
                    console.log('DANGER')
                    setStatus("danger");
                    setMessage("Password confirmation does not match the password field");
                    return notificationRef?.current?.showNotification();
                  }
                  else {
                    setIsLoading(true);
                    axiosInstance
                      .post("/cms-users/reset-password/reset", {
                        new_password,
                        token
                      })
                      .then(response => {
                        setStatus("success");
                        setMessage(
                          response?.data?.data?.message ||
                            "Ok, please login with the new password"
                        );
                        return notificationRef?.current?.showNotification();
                      })
                      .catch(error => {
                        setStatus("danger");
                        setMessage(
                          error?.response?.data?.message || "Something went wrong"
                        );
                        return notificationRef?.current?.showNotification();
                      })
                      .finally(() => setIsLoading(false));
                  }
                }}
                xs={12}
                sm={12}
                md={12}
                disabled={
                  !new_password_confirmation.length ||
                  !new_password.length ||
                  isLoading
                }
              >
                Set new password
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <PopupNotification
        ref={notificationRef}
        status={status}
        message={message}
        onHideNotification={() => {
          if (status === "success") {
            history.push("/login")
          }
        }}
      />
    </div>
  );
};

NewPassword.propTypes = {
  location: object
};

export default NewPassword;
