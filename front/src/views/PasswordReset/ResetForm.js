import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
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
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  }
};
const useStyles = makeStyles(styles);

const ResetForm = ({ location }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("success");
  const [message, setMessage] = useState("This is fine");
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();
  const notificationRef = useRef(null);

  const { from } = location.state || { from: { pathname: "/" } };

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

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
              <h4 className={classes.cardTitleWhite}>Reset password</h4>
              <p className={classes.cardCategoryWhite}>
                We will send your password reset link to the entered email
              </p>
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
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Muted>
                <Link href="/login" variant="body2">
                  Login
                </Link>
              </Muted>
              <Button
                color="primary"
                type="submit"
                onClick={() => {
                  setIsLoading(true);
                  axiosInstance
                    .post("/cms-users/reset-password/create", {
                      email
                    })
                    .then(response => {
                      setStatus("success");
                      setMessage(`${response?.data?.message || "Ok"}`);
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
                }}
                xs={12}
                sm={12}
                md={12}
                disabled={!email.length || isLoading}
              >
                Reset password
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

ResetForm.propTypes = {
  location: object
};

export default ResetForm;
